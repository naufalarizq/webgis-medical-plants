"""merge multiple heads

Revision ID: eb0d8da9ed8a
Revises: 714a75aa9e89, 0d7274724462
Create Date: 2026-05-18 09:15:38.571867+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eb0d8da9ed8a'
down_revision: Union[str, Sequence[str], None] = ('714a75aa9e89', '0d7274724462')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
