import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000/api"

# Unique Dataset of 6 highly realistic crash logs
DATASET = [
    {
        "title": "React Frontend - Null Pointer Exception",
        "log": """
TypeError: Cannot read properties of null (reading 'map')
    at IncidentList (http://localhost:3000/static/js/bundle.js:1425:29)
    at renderWithHooks (http://localhost:3000/static/js/bundle.js:42145:18)
    at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:45429:13)
        """
    },
    {
        "title": "PostgreSQL DB - Connection Pool Exhausted",
        "log": """
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL:  too many connections for role "halcyon_user"
(Background on this error at: https://sqlalche.me/e/20/e3q8)
        """
    },
    {
        "title": "Node.js File System - Permission Denied",
        "log": """
Error: EACCES: permission denied, mkdir '/app/uploads'
    at Object.mkdirSync (node:fs:1396:3)
    at module.exports.createDir (/app/src/utils/fileSystem.js:12:8)
    at runMicrotasks (<anonymous>)
        """
    },
    {
        "title": "Python Data Science - Memory Error",
        "log": """
Traceback (most recent call last):
  File "train_model.py", line 45, in <module>
    matrix = np.zeros((100000, 100000))
numpy.core._exceptions._ArrayMemoryError: Unable to allocate 74.5 GiB for an array with shape (100000, 100000) and data type float64
        """
    },
    {
        "title": "FastAPI Auth - JWT Expired",
        "log": """
Traceback (most recent call last):
  File "/usr/local/lib/python3.10/site-packages/jwt/api_jwt.py", line 228, in decode
    self._validate_claims(payload, merged_options, **kwargs)
  File "/usr/local/lib/python3.10/site-packages/jwt/api_jwt.py", line 337, in _validate_claims
    raise ExpiredSignatureError("Signature has expired")
jwt.exceptions.ExpiredSignatureError: Signature has expired
        """
    },
    {
        "title": "NGINX - Gateway Timeout",
        "log": """
2026/07/17 14:02:15 [error] 42#42: *12345 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 192.168.1.10, server: halcyon.local, request: "POST /api/incidents HTTP/1.1", upstream: "http://127.0.0.1:8000/api/incidents", host: "halcyon.local"
        """
    }
]

async def run_tests():
    print("🚀 Starting Halcyon Dataset Test...")
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        # 1. Register a new isolated user account
        print("\\n👤 Creating new test account (tester_dataset)...")
        email = "tester_dataset@halcyon.ai"
        pwd = "testpassword123"
        reg_res = await client.post(f"{BASE_URL}/auth/signup", json={
            "email": email,
            "username": "tester_dataset",
            "password": pwd
        })
        
        # 2. Login to get token
        print("🔑 Logging in to get token...")
        login_res = await client.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "username": "tester_dataset",
            "password": pwd
        })
        
        if login_res.status_code != 200:
            print("Failed to login:", login_res.text)
            return
            
        print("Login response:", login_res.text)
        token = login_res.json().get("access_token") or login_res.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}
        
        print(f"✅ Authenticated! Starting dataset ingestion ({len(DATASET)} incidents)...\\n")
        
        # 3. Submit each dataset log and check AI output
        for i, item in enumerate(DATASET, 1):
            print(f"==================================================")
            print(f"📝 TEST {i}/{len(DATASET)}: {item['title']}")
            print(f"==================================================")
            
            res = await client.post(
                f"{BASE_URL}/incidents", 
                headers=headers,
                json={
                    "alert_title": item["title"],
                    "log_content": item["log"]
                }
            )
            
            if res.status_code in (200, 201):
                data = res.json()
                print(f"✅ SUCCESS")
                print(json.dumps(data, indent=2))
            else:
                print(f"❌ ERROR: {res.status_code} - {res.text}")
                
            print("\\n")
            
    print("🎉 Dataset testing complete!")

if __name__ == "__main__":
    asyncio.run(run_tests())
