from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config.settings import get_settings
from app.routers import auth, chat, health

settings = get_settings()


app = FastAPI()

# Session middleware is required for OAuth state management
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.JWT_SECRET,  # Reuse JWT secret for session signing
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(chat.router)
