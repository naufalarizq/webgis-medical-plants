from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta

from src.database import get_db
from src.models import AdminUser
from src.schemas import Token, AdminUserResponse
from src.auth import verify_password, create_access_token, get_current_username, ACCESS_TOKEN_EXPIRE_HOURS

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AdminUser).where(AdminUser.username == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_HOURS * 3600,
        samesite="lax",
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AdminUserResponse)
async def read_users_me(
    username: str = Depends(get_current_username),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AdminUser).where(AdminUser.username == username))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}
