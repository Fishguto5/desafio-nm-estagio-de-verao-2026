from sqlmodel import select

from app.config.db import SessionDep
from app.models import User


def get_or_create_user(
    session: SessionDep,
    user_info: dict,
):
    # Check if user with this login already exists
    user_statement = select(User).where(User.github_id == user_info["id"])
    user = session.exec(user_statement).first()

    if user:
        # User exists
        return user

    # Create new user
    user = User(
        login=user_info["login"],
        name=user_info.get("name"),
        avatar_url=user_info.get("avatar_url"),
        github_id=user_info["id"],
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return user
