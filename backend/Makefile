host := 127.0.0.1
port := 8000

.PHONY: all run migrate-new migrate-up local-db-up local-db-down lint format check

all:
	@echo "no target specified"
	@exit 1

run:
	uvicorn src.main:app --reload --host $(host) --port $(port)

migrate-new:
	alembic revision --autogenerate -m "$(MSG)"

local-db-up:
	docker compose -f docker-compose.dev.yml up -d

local-db-down:
	docker compose -f docker-compose.dev.yml down

migrate-up:
	alembic upgrade head

lint:
	ruff check . --fix

format:
	ruff format .

check: lint format
