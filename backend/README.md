# Quick Start

## Prerequisites

* Python >= 3.14
* pip
* PostgreSQL >= 17
* PostGIS >= 3.5
* Make (optional)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate # OR `.venv\Scripts\activate` (Windows)
pip install -r requirements.txt
cp .env.example .env # Configure DB_URI
make migrate-up # OR `alembic upgrade head`
make run # OR `uvicorn src.main:app --reload`
```

API: [http://localhost:8000](http://localhost:8000)

Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

# Dependencies

| Package     | Version |
|-------------|---------|
| alembic     | 1.18.4  |
| asyncpg     | 0.31.0  |
| bcrypt      | 5.0.0   |
| fastapi     | 0.136.1 |
| geoalchemy2 | 0.20.0  |
| pyjwt       | 2.12.1  |
| ruff        | 0.15.12 |
| sqlalchemy  | 2.0.49  |
