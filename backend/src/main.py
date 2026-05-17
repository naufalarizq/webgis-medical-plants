from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from src.routers import public, admin, auth

app = FastAPI(title="WebGIS Medical Plants API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(public.router)
app.include_router(admin.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to WebGIS Medical Plants API"}
