from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, Response
from jose import JWTError, jwt

from app.config.settings import SettingsDep


def create_jwt(
    settings: SettingsDep,
    sub: str,
    alg: str,
    exp_minutes: int,
):
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=exp_minutes)

    payload = {
        "sub": sub,
        "iat": now,
        "exp": exp.timestamp(),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=alg)

    return token


def verify_jwt(settings: SettingsDep, token: str, alg: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[alg])
        return payload
    except JWTError:
        raise HTTPException(status_code=401)


def set_jwt_cookie(resp: Response, settings: SettingsDep, token: str, exp_minutes: int):
    resp.set_cookie(
        "access_token",
        token,
        httponly=True,
        secure=settings.ENV == "production",
        samesite="lax",
        max_age=exp_minutes * 60,
        path="/",
    )


def delete_jwt_cookie(resp: Response):
    resp.delete_cookie(
        "access_token",
        path="/",
    )
