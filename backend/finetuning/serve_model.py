import os
import re
import time
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
import uvicorn

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("model_server")

# Load model using Unsloth
from unsloth import FastLanguageModel
import torch

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "models", "halcyon-llama3.2-3b-lora"))

logger.info(f"Loading base model and adapters from {MODEL_DIR}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_DIR,
    max_seq_length=1024,
    dtype=None,
    load_in_4bit=True,
)
FastLanguageModel.for_inference(model) # Enable native 2x faster inference
logger.info("Model loaded successfully!")

app = FastAPI(title="Halcyon Local LLM Server")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.2
    max_tokens: Optional[int] = 1024

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    logger.info(f"Received completion request for model: {request.model}")
    
    # Format the prompt using the chat template
    formatted_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    
    try:
        inputs = tokenizer.apply_chat_template(
            formatted_messages,
            tokenize=True,
            add_generation_prompt=True,
            return_tensors="pt"
        ).to("cuda")
        
        start_time = time.perf_counter()
        with torch.no_grad():
            outputs = model.generate(
                input_ids=inputs,
                max_new_tokens=request.max_tokens or 512,
                temperature=request.temperature or 0.2,
                use_cache=True,
                pad_token_id=tokenizer.eos_token_id
            )
        latency = (time.perf_counter() - start_time) * 1000
        
        # Decode the output
        generated_tokens = outputs[0][inputs.shape[1]:]
        raw_text = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()
        
        # Remove reasoning <think> blocks if present
        raw_text = re.sub(r"<think>.*?</think>", "", raw_text, flags=re.DOTALL).strip()
        
        # Calculate tokens
        prompt_tokens = inputs.shape[1]
        completion_tokens = len(generated_tokens)
        total_tokens = prompt_tokens + completion_tokens
        
        logger.info(f"Generated response in {latency:.1f}ms. Completion tokens: {completion_tokens}")
        
        # Return OpenAI-compatible response format
        return {
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": request.model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": raw_text
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens
            }
        }
    except Exception as e:
        logger.error(f"Error generating completions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [
            {
                "id": "halcyon-llama3.2-3b",
                "object": "model",
                "created": int(time.time()),
                "owned_by": "halcyon"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=11434)
