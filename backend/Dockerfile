# syntax=docker/dockerfile:1.7

# Stage 1: Build Stage
FROM ghcr.io/astral-sh/uv:python3.12-bookworm AS builder

WORKDIR /app

# Copy pyproject.toml and uv.lock to install dependencies
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --locked

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
FROM ghcr.io/astral-sh/uv:python3.12-bookworm AS production

WORKDIR /app

# Copy installed packages and application code from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app ./

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD curl -fsS "http://localhost:8000/health" || exit 1

  
# Expose the port FastAPI will run on
EXPOSE 8000
  
# Command to run Alembic migrations
# Command to run the FastAPI application with Uvicorn
CMD uv run alembic upgrade head && uv run uvicorn app.main:app --host "${HOST:-0.0.0.0}" --port "${PORT:-8000}"
