import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine, pool
from sqlalchemy.engine import Connection
from sqlmodel import SQLModel

# Import models for autogenerate support
from app.config import get_settings
from app.models import Chat, Message, User  # noqa: F401

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = SQLModel.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_database_url() -> str:
    """Get database URL from app settings or environment variable."""
    # Try multiple sources in order of preference:
    # 1. App settings (reads from .env file)
    # 2. Environment variable
    # 3. alembic.ini (as last resort)
    try:
        settings = get_settings()
        url = settings.DATABASE_URL
    except Exception:
        url = None

    if not url:
        url = os.getenv("DATABASE_URL")

    if not url:
        ini_url = config.get_main_option("sqlalchemy.url")
        url = ini_url or ""

    # Validate URL is not a placeholder
    placeholder_url = "driver://user:pass@localhost/dbname"
    if not url or url == placeholder_url or url.startswith("driver://"):
        msg = (
            "DATABASE_URL not configured. Please set DATABASE_URL "
            "environment variable or create a .env file with DATABASE_URL. "
            "Example: postgresql+psycopg2://user:password@localhost/dbname"
        )
        raise ValueError(msg)

    return url


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = get_database_url()
    # Ensure the URL uses psycopg2 driver
    url = _ensure_psycopg2_url(url)
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def _ensure_psycopg2_url(database_url: str) -> str:
    """Ensure the database URL uses psycopg2 driver."""
    # Ensure the URL uses psycopg2 driver (not asyncpg or other drivers)
    if "+psycopg2" not in database_url:
        if database_url.startswith("postgresql://"):
            database_url = database_url.replace(
                "postgresql://", "postgresql+psycopg2://", 1
            )
        elif "+" in database_url:
            # Replace any other driver with psycopg2
            parts = database_url.split("://", 1)
            if len(parts) == 2:
                scheme = parts[0].split("+")[0]
                database_url = f"{scheme}+psycopg2://{parts[1]}"
    return database_url


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Get database URL from app settings - ensure it uses psycopg2
    database_url = get_database_url()
    database_url = _ensure_psycopg2_url(database_url)

    # Create synchronous engine with psycopg2
    connectable = create_engine(
        database_url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        do_run_migrations(connection)

    connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
