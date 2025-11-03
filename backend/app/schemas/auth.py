from typing import Optional

from pydantic import BaseModel


class UserCreated(BaseModel):
    id: int
    login: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
