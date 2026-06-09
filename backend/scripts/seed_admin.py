import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create an admin user.")
    parser.add_argument("--username", required=True, help="Admin username for login.")
    parser.add_argument("--email", required=True, help="Admin email address.")
    parser.add_argument("--password", required=True, help="Admin password.")
    return parser.parse_args()


async def create_admin(username: str, email: str, password: str) -> None:
    from sqlalchemy import or_, select

    from src.auth import get_password_hash
    from src.database import async_factory
    from src.models import AdminUser

    async with async_factory() as session:
        result = await session.execute(
            select(AdminUser).where(
                or_(AdminUser.username == username, AdminUser.email == email)
            )
        )
        existing_admin = result.scalars().first()
        if existing_admin is not None:
            conflicts = []
            if existing_admin.username == username:
                conflicts.append(f"username '{username}'")
            if existing_admin.email == email:
                conflicts.append(f"email '{email}'")
            conflict_text = " and ".join(conflicts)
            raise ValueError(f"Admin user with {conflict_text} already exists.")

        admin = AdminUser(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            is_active=True,
        )
        session.add(admin)
        await session.commit()


async def main() -> None:
    args = parse_args()
    from src.database import engine

    try:
        await create_admin(args.username, args.email, args.password)
    finally:
        await engine.dispose()
    print(f"Created active admin user '{args.username}' with email '{args.email}'.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except ValueError as exc:
        raise SystemExit(str(exc)) from None
