"""
app/repositories/attendance_repository.py
──────────────────────────────────────────
Raw database layer for attendance records.
"""

from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import date, datetime
from typing import Optional


COLLECTION = "attendance"


class AttendanceRepository:
    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.col = db[COLLECTION]

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _date_to_str(d) -> str:
        if isinstance(d, datetime):
            return d.date().isoformat()
        if isinstance(d, date):
            return d.isoformat()
        return str(d)

    # ── Read ──────────────────────────────────────────────────────────────────

    async def find_by_employee(self, employee_id: str) -> list[dict]:
        """All records for one employee, newest first."""
        cursor = self.col.find(
            {"employee_id": employee_id},
            {"_id": 0},
        ).sort("date", -1)
        docs = await cursor.to_list(length=None)
        for doc in docs:
            doc["date"] = self._date_to_str(doc.get("date"))
        return docs

    async def find_by_date(self, target_date: date) -> list[dict]:
        """All records for a specific date."""
        # Store dates as ISO strings for simplicity with MongoDB
        date_str = target_date.isoformat()
        cursor = self.col.find({"date": date_str}, {"_id": 0})
        return await cursor.to_list(length=None)

    async def find_one(self, employee_id: str, target_date: date) -> Optional[dict]:
        """Find single record by (employee_id, date) — the unique key."""
        doc = await self.col.find_one(
            {"employee_id": employee_id, "date": target_date.isoformat()},
            {"_id": 0},
        )
        return doc

    async def count_by_employee_status(self, employee_id: str, status: str) -> int:
        return await self.col.count_documents(
            {"employee_id": employee_id, "status": status}
        )

    async def count_by_employee(self, employee_id: str) -> int:
        return await self.col.count_documents({"employee_id": employee_id})

    async def summary_by_employee(self, employee_id: str) -> dict:
        """Aggregate present/absent counts for one employee."""
        pipeline = [
            {"$match": {"employee_id": employee_id}},
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1},
                }
            },
        ]
        results = await self.col.aggregate(pipeline).to_list(length=None)
        counts = {r["_id"]: r["count"] for r in results}
        present = counts.get("Present", 0)
        absent = counts.get("Absent", 0)
        total = present + absent
        rate = round((present / total) * 100, 1) if total > 0 else 0.0
        return {
            "employee_id": employee_id,
            "total_days": total,
            "present_days": present,
            "absent_days": absent,
            "attendance_rate": rate,
        }

    async def today_summary(self) -> dict:
        """Count present/absent/unmarked for today (used in dashboard)."""
        today_str = date.today().isoformat()
        pipeline = [
            {"$match": {"date": today_str}},
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        ]
        results = await self.col.aggregate(pipeline).to_list(length=None)
        counts = {r["_id"]: r["count"] for r in results}
        return {
            "present": counts.get("Present", 0),
            "absent": counts.get("Absent", 0),
            "marked_total": sum(counts.values()),
        }

    async def delete_by_employee(self, employee_id: str) -> int:
        """Cascade-delete all records when an employee is removed."""
        result = await self.col.delete_many({"employee_id": employee_id})
        return result.deleted_count

    # ── Write ─────────────────────────────────────────────────────────────────

    async def insert(self, employee_id: str, target_date: date, status: str) -> dict:
        """
        Insert a new attendance record.
        The unique index on (employee_id, date) prevents duplicates at DB level.
        """
        doc = {
            "employee_id": employee_id,
            "date": target_date.isoformat(),
            "status": status,
        }
        result = await self.col.insert_one(doc)
        inserted = await self.col.find_one(
            {"_id": result.inserted_id},
            {"_id": 0},
        )
        return inserted
