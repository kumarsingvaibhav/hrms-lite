"""
app/services/attendance_service.py
────────────────────────────────────
Business logic for attendance tracking.
"""

from datetime import date
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError

from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository
from app.models.attendance import AttendanceCreate, AttendanceOut, AttendanceSummary
from app.core.responses import not_found, bad_request, conflict


class AttendanceService:
    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.repo = AttendanceRepository(db)
        self.emp_repo = EmployeeRepository(db)

    # ── Mark attendance ───────────────────────────────────────────────────────

    async def mark_attendance(self, payload: AttendanceCreate) -> AttendanceOut:
        # 1. Employee must exist
        if not await self.emp_repo.exists(payload.employee_id):
            raise not_found(f"Employee '{payload.employee_id}' not found.")

        # 2. Cannot be a future date (also validated in Pydantic, double-checked here)
        if payload.date > date.today():
            raise bad_request("Attendance date cannot be in the future.")

        # 3. One entry per employee per date
        existing = await self.repo.find_one(payload.employee_id, payload.date)
        if existing:
            raise conflict(
                f"Attendance for employee '{payload.employee_id}' "
                f"on {payload.date.isoformat()} is already recorded as '{existing['status']}'."
            )

        try:
            doc = await self.repo.insert(
                employee_id=payload.employee_id,
                target_date=payload.date,
                status=payload.status.value,
            )
        except DuplicateKeyError:
            # Race-condition safety net
            raise conflict(
                f"Attendance already exists for '{payload.employee_id}' on {payload.date}."
            )

        return AttendanceOut.from_doc(doc)

    # ── Get attendance for one employee ───────────────────────────────────────

    async def get_employee_attendance(self, employee_id: str) -> list[AttendanceOut]:
        if not await self.emp_repo.exists(employee_id):
            raise not_found(f"Employee '{employee_id}' not found.")

        docs = await self.repo.find_by_employee(employee_id)
        return [AttendanceOut.from_doc(d) for d in docs]

    # ── Get attendance by date ────────────────────────────────────────────────

    async def get_attendance_by_date(self, target_date: date) -> list[AttendanceOut]:
        if target_date > date.today():
            raise bad_request("Cannot query attendance for a future date.")
        docs = await self.repo.find_by_date(target_date)
        return [AttendanceOut.from_doc(d) for d in docs]

    # ── Summary per employee ──────────────────────────────────────────────────

    async def get_employee_summary(self, employee_id: str) -> AttendanceSummary:
        if not await self.emp_repo.exists(employee_id):
            raise not_found(f"Employee '{employee_id}' not found.")

        data = await self.repo.summary_by_employee(employee_id)
        return AttendanceSummary(**data)

    # ── Today's dashboard stats ───────────────────────────────────────────────

    async def get_today_summary(self) -> dict:
        return await self.repo.today_summary()
