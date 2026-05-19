host := 127.0.0.1
port := 8000

.PHONY: all run migrate-new migrate-up lint format check

all:
	@echo "no target specified"
	@exit 1

run:
	uvicorn src.main:app --reload --host $(host) --port $(port)

migrate-new:
	alembic revision --autogenerate -m "$(MSG)"

migrate-up:
	alembic upgrade head

lint:
	ruff check . --fix

format:
	ruff format .

check: lint format
