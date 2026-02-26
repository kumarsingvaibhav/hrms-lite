"""
app/routes/attendance.py
─────────────────────────
Attendance REST endpoints.

POST   /api/v1/attendance                          — mark attendance
GET    /api/v1/attendance/employee/{id}            — history for one employee
GET    /api/v1/attendance/employee/{id}/summary    — stats for one employee
GET    /api/v1/attendance/date/{date}              — all records on a date
"""

from fastapi import APIRouter, Depends, status
from datetime import date
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.core.responses import success_response, created_response
from app.models.attendance import AttendanceCreate
from app.services.attendance_service import AttendanceService


router = APIRouter(prefix="/attendance", tags=["Attendance"])


def get_service(db: AsyncIOMotorDatabase = Depends(get_db)) -> AttendanceService:
    return AttendanceService(db)


# ── POST /attendance ──────────────────────────────────────────────────────────

@router.post(
    "",
    summary="Mark attendance for an employee",
    status_code=status.HTTP_201_CREATED,
)
async def mark_attendance(
    payload: AttendanceCreate,
    svc: AttendanceService = Depends(get_service),
):
    record = await svc.mark_attendance(payload)
    return created_response(
        data=record.model_dump(),
        message=(
            f"Attendance marked: {record.employee_id} → "
            f"{record.status} on {record.date}"
        ),
    )


# ── GET /attendance/employee/{employee_id} ────────────────────────────────────

@router.get(
    "/employee/{employee_id}",
    summary="Get full attendance history for an employee",
    status_code=status.HTTP_200_OK,
)
async def get_employee_attendance(
    employee_id: str,
    svc: AttendanceService = Depends(get_service),
):
    records = await svc.get_employee_attendance(employee_id.upper())
    return success_response(
        data=[r.model_dump() for r in records],
        message=f"{len(records)} record(s) found for '{employee_id}'.",
    )


# ── GET /attendance/employee/{employee_id}/summary ────────────────────────────

@router.get(
    "/employee/{employee_id}/summary",
    summary="Get attendance summary (present/absent counts + rate) for an employee",
    status_code=status.HTTP_200_OK,
)
async def get_employee_summary(
    employee_id: str,
    svc: AttendanceService = Depends(get_service),
):
    summary = await svc.get_employee_summary(employee_id.upper())
    return success_response(data=summary.model_dump())


# ── GET /attendance/date/{date} ───────────────────────────────────────────────

@router.get(
    "/date/{target_date}",
    summary="Get all attendance records for a specific date (YYYY-MM-DD)",
    status_code=status.HTTP_200_OK,
)
async def get_attendance_by_date(
    target_date: date,
    svc: AttendanceService = Depends(get_service),
):
    records = await svc.get_attendance_by_date(target_date)
    return success_response(
        data=[r.model_dump() for r in records],
        message=f"{len(records)} record(s) found for {target_date}.",
    )
