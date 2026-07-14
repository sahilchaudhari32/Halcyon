import urllib.request
import urllib.parse
import json

token = "rnd_ZwIBk1IaUarpJuL8KTsXhlIT89TC"
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# 1. Get ownerId
try:
    req_owners = urllib.request.Request("https://api.render.com/v1/owners", headers=headers)
    resp_owners = urllib.request.urlopen(req_owners)
    owners = json.loads(resp_owners.read().decode('utf-8'))
    owner_id = owners[0]["owner"]["id"]
    print(f"Got owner_id: {owner_id}")
except Exception as e:
    print(f"Error getting owner: {e}")
    exit(1)

# 2. Create service
url = "https://api.render.com/v1/services"
data = {
    "type": "web_service",
    "name": "halcyon-backend",
    "ownerId": owner_id,
    "repo": "https://github.com/Priyankkhatri/Halcyon",
    "autoDeploy": "yes",
    "branch": "main",
    "serviceDetails": {
        "plan": "free",
        "env": "python",
        "envSpecificDetails": {
            "buildCommand": "cd backend && pip install -r requirements.txt",
            "startCommand": "cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT"
        },
        "envVars": [
            {"key": "CASCADEFLOW_ENABLED", "value": "true"},
            {"key": "HINDSIGHT_ENABLED", "value": "true"}
        ]
    }
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')

try:
    response = urllib.request.urlopen(req)
    print("Render Service Created!")
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
