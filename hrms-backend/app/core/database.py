"""
app/core/database.py
─────────────────────
Async MongoDB connection using Motor.
Provides a singleton client + db reference and index bootstrapping.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, IndexModel
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


db_state = Database()


async def connect_db() -> None:
    """Open Motor connection and ensure indexes exist."""
    logger.info("Connecting to MongoDB at %s …", settings.MONGODB_URL)
    db_state.client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        serverSelectionTimeoutMS=5_000,
    )
    db_state.db = db_state.client[settings.MONGODB_DB_NAME]

    # Validate connectivity
    await db_state.client.admin.command("ping")
    logger.info("MongoDB connected — database: %s", settings.MONGODB_DB_NAME)

    await _create_indexes()


async def disconnect_db() -> None:
    """Gracefully close the Motor connection."""
    if db_state.client:
        db_state.client.close()
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency — returns the active database handle."""
    if db_state.db is None:
        raise RuntimeError("Database is not initialised. Call connect_db() first.")
    return db_state.db


# ── Index bootstrap ──────────────────────────────────────────────────────────

async def _create_indexes() -> None:
    """Idempotently create all required indexes."""
    db = db_state.db

    # employees collection
    await db["employees"].create_indexes([
        IndexModel([("employee_id", ASCENDING)], unique=True, name="idx_employee_id"),
        IndexModel([("email", ASCENDING)], unique=True, name="idx_email"),
        IndexModel([("department", ASCENDING)], name="idx_department"),
        IndexModel([("created_at", ASCENDING)], name="idx_created_at"),
    ])

    # attendance collection
    await db["attendance"].create_indexes([
        IndexModel(
            [("employee_id", ASCENDING), ("date", ASCENDING)],
            unique=True,
            name="idx_employee_date_unique",
        ),
        IndexModel([("employee_id", ASCENDING)], name="idx_att_employee_id"),
        IndexModel([("date", ASCENDING)], name="idx_att_date"),
        IndexModel([("status", ASCENDING)], name="idx_att_status"),
    ])

    logger.info("MongoDB indexes verified.")
