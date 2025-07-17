"""add only image_url column

Revision ID: h3i4j5k6l7m8
Revises: 7b5799dd8ccb
Create Date: 2025-06-26 18:11:30.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "h3i4j5k6l7m8"
down_revision: str | None = "7b5799dd8ccb"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Check if image_url column exists, add only if it doesn't
    connection = op.get_bind()
    result = connection.execute(
        sa.text(
            """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'adventures' AND column_name = 'image_url'
    """
        )
    )

    if not result.fetchone():
        op.add_column("adventures", sa.Column("image_url", sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove image_url column if it exists
    connection = op.get_bind()
    result = connection.execute(
        sa.text(
            """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'adventures' AND column_name = 'image_url'
    """
        )
    )

    if result.fetchone():
        op.drop_column("adventures", "image_url")
