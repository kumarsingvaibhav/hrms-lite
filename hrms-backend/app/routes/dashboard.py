"""
app/routes/dashboard.py
────────────────────────
Dashboard summary endpoint — aggregates data for the frontend home screen.

GET /api/v1/dashboard
"""

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.core.responses import success_response
from app.services.employee_service import EmployeeService
from app.services.attendance_service import AttendanceService


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "",
    summary="Dashboard summary — employee count + today's attendance stats",
    status_code=status.HTTP_200_OK,
)
async def get_dashboard(db: AsyncIOMotorDatabase = Depends(get_db)):
    emp_svc = EmployeeService(db)
    att_svc = AttendanceService(db)

    total_employees = await emp_svc.get_total_count()
    today_att = await att_svc.get_today_summary()

    return success_response(
        data={
            "total_employees": total_employees,
            "today": {
                "present": today_att["present"],
                "absent": today_att["absent"],
                "not_marked": max(total_employees - today_att["marked_total"], 0),
                "marked_total": today_att["marked_total"],
            },
        },
        message="Dashboard data loaded successfully.",
    )
