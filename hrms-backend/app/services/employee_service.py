"""
app/services/employee_service.py
──────────────────────────────────
Business logic for employee management.
Sits between routes and repositories.
Raises HTTPExceptions that FastAPI will serialise automatically.
"""

from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError

from app.repositories.employee_repository import EmployeeRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.models.employee import EmployeeCreate, EmployeeOut
from app.core.responses import conflict, not_found


class EmployeeService:
    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.repo = EmployeeRepository(db)
        self.att_repo = AttendanceRepository(db)

    # ── List ──────────────────────────────────────────────────────────────────

    async def get_all_employees(self) -> list[EmployeeOut]:
        docs = await self.repo.find_all()
        return [EmployeeOut.from_doc(d) for d in docs]

    # ── Get one ───────────────────────────────────────────────────────────────

    async def get_employee(self, employee_id: str) -> EmployeeOut:
        doc = await self.repo.find_by_employee_id(employee_id)
        if not doc:
            raise not_found(f"Employee '{employee_id}' not found.")
        return EmployeeOut.from_doc(doc)

    # ── Create ────────────────────────────────────────────────────────────────

    async def create_employee(self, payload: EmployeeCreate) -> EmployeeOut:
        # Manual duplicate checks give clearer error messages than the DB error
        if await self.repo.find_by_employee_id(payload.employee_id):
            raise conflict(f"Employee ID '{payload.employee_id}' is already in use.")

        if await self.repo.find_by_email(payload.email):
            raise conflict(f"Email '{payload.email}' is already registered.")

        try:
            doc = await self.repo.insert(payload.model_dump())
        except DuplicateKeyError as exc:
            # Safety net for race conditions
            key = "employee_id" if "employee_id" in str(exc) else "email"
            raise conflict(f"Duplicate value for '{key}'.")

        return EmployeeOut.from_doc(doc)

    # ── Delete ────────────────────────────────────────────────────────────────

    async def delete_employee(self, employee_id: str) -> dict:
        if not await self.repo.exists(employee_id):
            raise not_found(f"Employee '{employee_id}' not found.")

        # Cascade: remove all attendance records for this employee
        deleted_att = await self.att_repo.delete_by_employee(employee_id)
        await self.repo.delete_by_employee_id(employee_id)

        return {
            "employee_id": employee_id,
            "attendance_records_deleted": deleted_att,
        }

    # ── Stats (for dashboard) ─────────────────────────────────────────────────

    async def get_total_count(self) -> int:
        return await self.repo.count()
