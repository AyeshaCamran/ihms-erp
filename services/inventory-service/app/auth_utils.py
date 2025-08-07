# auth_utils.py in inventory-service
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
ALGORITHM = os.getenv("ALGORITHM")



def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials  # ✅ move inside try block
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        print("TOKEN:", credentials.credentials)
        print("SECRET_KEY:", SECRET_KEY)
        print("ALGORITHM:", ALGORITHM)

        return {
            "email": payload.get("sub"),
            "role": payload.get("role"),
            "name": payload.get("name"),
            "department": payload.get("department")
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
