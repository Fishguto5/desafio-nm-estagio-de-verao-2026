from typing import Annotated

from authlib.integrations.starlette_client import OAuth  # type: ignore
from fastapi import Depends, HTTPException, Request

from app.config.db import SessionDep
from app.config.settings import Settings, SettingsDep, get_settings
from app.models import User
from app.schemas.auth import UserCreated
from app.utils.auth import verify_jwt

oauth = OAuth()

JWT_ALG = "HS256"
JWT_EXP_MINUTES = 60


def init_oauth(settings: Settings) -> None:
    oauth.register(
        name="github",
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        access_token_url="https://github.com/login/oauth/access_token",
        access_token_params=None,
        authorize_url="https://github.com/login/oauth/authorize",
        authorize_params=None,
        api_base_url="https://api.github.com",
        client_kwargs={"scope": "read:user user:email"},
        server_metadata_url=None,  # GitHub doesn't use OIDC discovery
    )


def get_current_user(request: Request, settings: SettingsDep, session: SessionDep):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    payload = verify_jwt(settings, token, JWT_ALG)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    assert user.id is not None
    return UserCreated(
        id=user.id,
        login=user.login,
        name=user.name,
        avatar_url=user.avatar_url,
    )


UserDep = Annotated[UserCreated, Depends(get_current_user)]

# Initialize on module import
init_oauth(get_settings())
