"""
app/repositories/employee_repository.py
─────────────────────────────────────────
Raw database layer for employees.
Only this module speaks directly to the MongoDB collection.
Services call this; routes never call this directly.
"""

from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from pymongo.errors import DuplicateKeyError


COLLECTION = "employees"


class EmployeeRepository:
    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.col = db[COLLECTION]

    # ── Read ──────────────────────────────────────────────────────────────────

    async def find_all(self) -> list[dict]:
        """Return all employees sorted by creation date (newest first)."""
        cursor = self.col.find({}, {"_id": 0}).sort("created_at", -1)
        return await cursor.to_list(length=None)

    async def find_by_employee_id(self, employee_id: str) -> Optional[dict]:
        return await self.col.find_one({"employee_id": employee_id}, {"_id": 0})

    async def find_by_email(self, email: str) -> Optional[dict]:
        return await self.col.find_one({"email": email}, {"_id": 0})

    async def exists(self, employee_id: str) -> bool:
        doc = await self.col.find_one(
            {"employee_id": employee_id},
            {"_id": 1},
        )
        return doc is not None

    async def count(self) -> int:
        return await self.col.count_documents({})

    # ── Write ─────────────────────────────────────────────────────────────────

    async def insert(self, data: dict) -> dict:
        """
        Insert a new employee document.
        Returns the inserted document (without MongoDB _id).
        Raises DuplicateKeyError if employee_id or email already exists.
        """
        doc = {
            **data,
            "created_at": datetime.now(timezone.utc),
        }
        result = await self.col.insert_one(doc)
        # Return back clean document (exclude _id)
        inserted = await self.col.find_one(
            {"_id": result.inserted_id},
            {"_id": 0},
        )
        return inserted

    async def delete_by_employee_id(self, employee_id: str) -> bool:
        """
        Delete employee by employee_id.
        Returns True if a document was deleted, False if not found.
        """
        result = await self.col.delete_one({"employee_id": employee_id})
        return result.deleted_count > 0
