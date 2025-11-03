from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine

from app.config.settings import get_settings

settings = get_settings()

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=settings.ENV == "development", future=True)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
