import os
import tempfile
from huggingface_hub import HfApi

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
GGUF_PATH = os.path.join(ROOT_DIR, "models", "halcyon-llama3.2-3b-gguf_gguf", "Llama-3.2-3B-Instruct.Q4_K_M.gguf")

def main():
    print("Checking Hugging Face credentials...")
    api = HfApi()
    try:
        user_info = api.whoami()
        username = user_info["name"]
        print(f"Logged in as Hugging Face user: {username}")
    except Exception as e:
        print("\n[ERROR] You are not logged in to Hugging Face.")
        print("Please run the following command in your terminal first to log in:")
        print("  hf auth login")
        return

    if not os.path.exists(GGUF_PATH):
        print(f"\n[ERROR] GGUF model file not found at: {GGUF_PATH}")
        return

    repo_id = f"{username}/halcyon-model-server"
    print(f"\nCreating Hugging Face Space: {repo_id} (Docker)...")
    
    try:
        api.create_repo(
            repo_id=repo_id,
            repo_type="space",
            space_sdk="docker",
            private=False,
            exist_ok=True
        )
        print("Space repository created/verified successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to create repository: {e}")
        return

    # Create temporary Dockerfile
    dockerfile_content = """FROM ghcr.io/ggerganov/llama.cpp:server
COPY Llama-3.2-3B-Instruct.Q4_K_M.gguf /model.gguf
ENV PORT=7860
EXPOSE 7860
ENTRYPOINT ["/llama-server", "-m", "/model.gguf", "-c", "2048", "--host", "0.0.0.0", "--port", "7860"]
"""
    
    with tempfile.TemporaryDirectory() as tmpdir:
        dockerfile_path = os.path.join(tmpdir, "Dockerfile")
        with open(dockerfile_path, "w", encoding="utf-8") as f:
            f.write(dockerfile_content)

        print("\nUploading Dockerfile...")
        api.upload_file(
            path_or_fileobj=dockerfile_path,
            path_in_repo="Dockerfile",
            repo_id=repo_id,
            repo_type="space"
        )
        print("Dockerfile uploaded.")

    print(f"\nUploading GGUF model (2.02 GB) to {repo_id}...")
    print("This may take several minutes depending on your internet upload speed...")
    try:
        api.upload_file(
            path_or_fileobj=GGUF_PATH,
            path_in_repo="Llama-3.2-3B-Instruct.Q4_K_M.gguf",
            repo_id=repo_id,
            repo_type="space"
        )
        print("\nGGUF model uploaded successfully!")
        
        space_url = f"https://huggingface.co/spaces/{repo_id}"
        api_url = f"https://{username}-halcyon-model-server.hf.space/v1"
        
        print("\n" + "="*50)
        print("DEPLOYMENT SUCCESSFUL!")
        print(f"Hugging Face Space URL: {space_url}")
        print(f"OpenAI-compatible Endpoint: {api_url}")
        print("="*50)
        print("\nNext Steps:")
        print("1. Hugging Face is building your Space container. It will be ready in 1-2 minutes.")
        print("2. Once ready, you can configure your Render production backend environment variables:")
        print("   OLLAMA_ENABLED=true")
        print(f"   OLLAMA_URL={api_url}")
        print("   OLLAMA_MODEL=halcyon-llama3.2-3b")
        print("\nThis will make your custom trained model the default for all users 24/7!")
        
    except Exception as e:
        print(f"\n[ERROR] Upload failed: {e}")

if __name__ == "__main__":
    main()
