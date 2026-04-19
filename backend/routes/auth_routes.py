from fastapi import APIRouter, HTTPException, Response, Request, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user
import os

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

@router.post("/login")
async def login(request: LoginRequest, response: Response, db: AsyncIOMotorDatabase = Depends(lambda: None)):
    from server import db as database
    db = database
    
    email = request.email.lower()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    user.pop("password_hash", None)
    return user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_me(request: Request, db: AsyncIOMotorDatabase = Depends(lambda: None)):
    from server import db as database
    db = database
    user = await get_current_user(request, db)
    return user
