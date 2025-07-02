"""merge_image_url_migrations

Revision ID: 7b5799dd8ccb
Revises: g2h3i4j5k6l7
Create Date: 2025-06-26 18:11:00.380315

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b5799dd8ccb'
down_revision: Union[str, None] = 'g2h3i4j5k6l7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass