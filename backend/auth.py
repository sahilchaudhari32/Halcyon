import hashlib
import os
import secrets
from datetime import datetime, timezone
from typing import Optional

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2 with SHA-256 and a random salt."""
    salt = secrets.token_bytes(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + ":" + pwd_hash.hex()

def verify_password(password: str, stored: str) -> bool:
    """Verify a password against a stored PBKDF2 hash."""
    try:
        salt_hex, hash_hex = stored.split(":")
        salt = bytes.fromhex(salt_hex)
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        return pwd_hash.hex() == hash_hex
    except Exception:
        return False

def generate_session_token() -> str:
    """Generate a highly secure random token for user sessions."""
    return secrets.token_urlsafe(32)
