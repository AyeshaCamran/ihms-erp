# auth_utils.py in inventory-service
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # ✅ Add default

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        print(f"🔍 TOKEN RECEIVED: {token[:50]}...")  # ✅ Debug log
        print(f"🔑 SECRET_KEY: {SECRET_KEY}")
        print(f"📝 ALGORITHM: {ALGORITHM}")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"✅ DECODED PAYLOAD: {payload}")  # ✅ Debug log
        
        return {
            "email": payload.get("sub"),
            "role": payload.get("role"),
            "name": payload.get("name"),
            "department": payload.get("department")
        }
    except JWTError as e:
        print(f"❌ JWT ERROR: {str(e)}")  # ✅ Debug log
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"❌ GENERAL ERROR: {str(e)}")  # ✅ Debug log
        raise HTTPException(status_code=401, detail="Token validation failed")