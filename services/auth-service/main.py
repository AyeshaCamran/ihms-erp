from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
import os
import models, database
from auth import router as auth_router  # ✅ Modular route import

# ✅ Load environment variables
load_dotenv()

# ✅ Create DB tables if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ✅ CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Attach auth routes to FastAPI
app.include_router(auth_router)

# ✅ Custom OpenAPI with Bearer Auth for Swagger UI
def custom_openapi():
    openapi_schema = get_openapi(
        title="EMS Auth API",
        version="1.0.0",
        description="Authentication service for IHMS ERP",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", []).append({"BearerAuth": []})
    return openapi_schema

# ✅ Set the OpenAPI override explicitly
app.openapi = custom_openapi
