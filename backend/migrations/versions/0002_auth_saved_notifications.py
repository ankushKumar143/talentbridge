"""Email auth and database-backed saved jobs/notifications."""
from alembic import op
import sqlalchemy as sa

revision = "0002_auth_saved_notifications"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("users", sa.Column("google_id", sa.String(255), nullable=True))
    op.create_index("ix_users_google_id", "users", ["google_id"], unique=True)
    op.add_column("users", sa.Column("is_verified", sa.Boolean(), server_default=sa.true(), nullable=False))
    op.create_table("action_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.String(64), nullable=False), sa.Column("purpose", sa.String(30), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False), sa.Column("consumed_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_action_tokens_user_id", "action_tokens", ["user_id"])
    op.create_index("ix_action_tokens_token_hash", "action_tokens", ["token_hash"], unique=True)
    op.create_index("ix_action_tokens_purpose", "action_tokens", ["purpose"])
    op.create_table("saved_jobs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "job_id", name="uq_saved_job_user_job"))
    op.create_index("ix_saved_jobs_user_id", "saved_jobs", ["user_id"])
    op.create_index("ix_saved_jobs_job_id", "saved_jobs", ["job_id"])
    op.create_table("notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("kind", sa.String(40), nullable=False, server_default="general"),
        sa.Column("message", sa.String(500), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"])

def downgrade():
    op.drop_table("notifications")
    op.drop_table("saved_jobs")
    op.drop_table("action_tokens")
    op.drop_column("users", "is_verified")
    op.drop_index("ix_users_google_id", table_name="users")
    op.drop_column("users", "google_id")
