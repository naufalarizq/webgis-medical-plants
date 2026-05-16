"""Init models

Revision ID: 0d7274724462
Revises: 
Create Date: 2026-05-16 09:41:12.522199+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2


revision: str = '0d7274724462'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis;')

    op.create_table('admin_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_admin_users_email'), 'admin_users', ['email'], unique=True)
    op.create_index(op.f('ix_admin_users_id'), 'admin_users', ['id'], unique=False)
    op.create_index(op.f('ix_admin_users_username'), 'admin_users', ['username'], unique=True)
    op.create_table('plants',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nama', sa.String(length=255), nullable=False),
    sa.Column('nama_latin', sa.String(length=255), nullable=False),
    sa.Column('kategori', sa.Enum('tanaman_hias', 'tanaman_pangan', 'tanaman_herbal', 'tanaman_aromatik', 'tanaman_pelindung', name='kategoritanaman'), nullable=False),
    sa.Column('lokasi', sa.String(length=255), nullable=False),
    sa.Column('skala', sa.Integer(), nullable=False),
    sa.Column('jumlah', sa.Integer(), nullable=False),
    sa.Column('foto_url', sa.String(length=1024), nullable=True),
    sa.Column('geom', geoalchemy2.types.Geometry(geometry_type='POINT', srid=4326, dimension=2, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plants_id'), 'plants', ['id'], unique=False)
    op.create_index(op.f('ix_plants_nama'), 'plants', ['nama'], unique=False)
    op.create_index(op.f('ix_plants_nama_latin'), 'plants', ['nama_latin'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_plants_nama_latin'), table_name='plants')
    op.drop_index(op.f('ix_plants_nama'), table_name='plants')
    op.drop_index(op.f('ix_plants_id'), table_name='plants')
    op.drop_table('plants')
    op.drop_index(op.f('ix_admin_users_username'), table_name='admin_users')
    op.drop_index(op.f('ix_admin_users_id'), table_name='admin_users')
    op.drop_index(op.f('ix_admin_users_email'), table_name='admin_users')
    op.drop_table('admin_users')
