"""Merge challenge table migrations

Revision ID: de89a506b11e
Revises: 43f1f9b7fff1, c9f8e2d3a4b5
Create Date: 2025-06-26 16:31:16.952489

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "de89a506b11e"
down_revision: str | None = ("43f1f9b7fff1", "c9f8e2d3a4b5")
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
