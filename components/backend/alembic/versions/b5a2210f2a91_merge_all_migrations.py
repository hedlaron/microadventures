"""merge_all_migrations

Revision ID: b5a2210f2a91
Revises: h3i4j5k6l7m8, public_sharing_001
Create Date: 2025-06-27 11:35:11.072451

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b5a2210f2a91'
down_revision: Union[str, None] = ('h3i4j5k6l7m8', 'public_sharing_001')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass