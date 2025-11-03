from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    login: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    github_id: int
