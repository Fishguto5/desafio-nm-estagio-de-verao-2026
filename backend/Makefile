.PHONY: help install setup-env dev check lint lint-fix format format-check test build up down logs logs-db up-db db-generate db-migrate db-downgrade db-current db-history typecheck

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

## Quick Start
install: ## Install dependencies
	uv sync

setup-env: ## Copy `.env.example` to `.env`
	cp .env.example .env

## Development
dev: ## Start development server
	uv run fastapi dev

## Code Quality
check: ## Check code with Ruff
	uv run ruff check && uv run ty check

typecheck: ## Check code with ty
	uv run ty check

lint: ## Check code with Ruff
	uv run ruff check

lint-fix: ## Fix lint issues with Ruff
	uv run ruff check --fix

format: ## Format code with Ruff
	uv run ruff format

format-check: ## Check formatting with Ruff
	uv run ruff format --check

## Database Management
db-generate: ## Generate new migration
	uv run alembic revision --autogenerate

db-migrate: ## Apply all pending migrations
	uv run alembic upgrade head

db-downgrade: ## Rollback last migration
	uv run alembic downgrade -1

db-current: ## Show current database revision
	uv run alembic current

db-history: ## Show migration history
	uv run alembic history

## Testing
test: ## Run tests
	uv run pytest

## Docker
up: ## Start database docker service
	docker compose up -d db

down: ## Stop all Docker services
	docker compose down

logs: ## Show database container logs
	docker compose logs -f db
