# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# import database, models, schemas, auth
# from passlib.context import CryptContext
# from fastapi.middleware.cors import CORSMiddleware

# models.Base.metadata.create_all(bind=database.engine)

# app = FastAPI()
# # ✅ Allow frontend (React) to talk to backend (FastAPI)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # your frontend port
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def get_db():
#     db = database.SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @app.post("/register")
# def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     from models import User
#     db_user = db.query(User).filter(User.username == user.username).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
#     hashed_pw = pwd_context.hash(user.password)
#     new_user = User(username=user.username, hashed_password=hashed_pw, role=user.role)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return {"msg": "User created successfully"}

# @app.post("/login")
# def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     from models import User
#     db_user = db.query(User).filter(User.username == user.username).first()
#     if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     token = auth.create_access_token(data={"sub": db_user.username, "role": db_user.role})
#     return {"access_token": token, "token_type": "bearer"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
from auth import router as auth_router  # ✅ Modular route import

# ✅ Create DB tables if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ✅ CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Attach auth routes to FastAPI
app.include_router(auth_router)

