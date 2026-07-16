import os
from huggingface_hub import HfApi

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
GGUF_PATH = os.path.join(ROOT_DIR, "models", "halcyon-llama3.2-3b-gguf_gguf", "Llama-3.2-3B-Instruct.Q4_K_M.gguf")

def main():
    api = HfApi()
    try:
        user_info = api.whoami()
        username = user_info["name"]
        print(f"Logged in as Hugging Face user: {username}")
    except Exception as e:
        print("[ERROR] Not logged in to Hugging Face.")
        return

    repo_id = f"{username}/halcyon-llama3.2-3b-gguf"
    print(f"Creating Hugging Face Model Repository (Free Storage): {repo_id}...")
    
    try:
        api.create_repo(
            repo_id=repo_id,
            repo_type="model",
            private=False,
            exist_ok=True
        )
        print("Model repository created/verified successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to create repository: {e}")
        return

    print(f"\nUploading GGUF model to {repo_id}...")
    try:
        api.upload_file(
            path_or_fileobj=GGUF_PATH,
            path_in_repo="Llama-3.2-3B-Instruct.Q4_K_M.gguf",
            repo_id=repo_id,
            repo_type="model"
        )
        print("\nGGUF model uploaded successfully!")
        print(f"Download URL for Colab: https://huggingface.co/{repo_id}/resolve/main/Llama-3.2-3B-Instruct.Q4_K_M.gguf")
    except Exception as e:
        print(f"\n[ERROR] Upload failed: {e}")

if __name__ == "__main__":
    main()
