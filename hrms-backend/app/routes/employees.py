"""
app/routes/employees.py
────────────────────────
Employee REST endpoints.

GET    /api/v1/employees              — list all
POST   /api/v1/employees              — create
GET    /api/v1/employees/{id}         — get one
DELETE /api/v1/employees/{id}         — delete (cascades attendance)
"""

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.core.responses import success_response, created_response
from app.models.employee import EmployeeCreate
from app.services.employee_service import EmployeeService


router = APIRouter(prefix="/employees", tags=["Employees"])


def get_service(db: AsyncIOMotorDatabase = Depends(get_db)) -> EmployeeService:
    return EmployeeService(db)


# ── GET /employees ────────────────────────────────────────────────────────────

@router.get(
    "",
    summary="List all employees",
    status_code=status.HTTP_200_OK,
)
async def list_employees(svc: EmployeeService = Depends(get_service)):
    employees = await svc.get_all_employees()
    return success_response(
        data=[e.model_dump() for e in employees],
        message=f"{len(employees)} employee(s) found.",
    )


# ── POST /employees ───────────────────────────────────────────────────────────

@router.post(
    "",
    summary="Create a new employee",
    status_code=status.HTTP_201_CREATED,
)
async def create_employee(
    payload: EmployeeCreate,
    svc: EmployeeService = Depends(get_service),
):
    employee = await svc.create_employee(payload)
    return created_response(
        data=employee.model_dump(),
        message=f"Employee '{employee.employee_id}' created successfully.",
    )


# ── GET /employees/{employee_id} ──────────────────────────────────────────────

@router.get(
    "/{employee_id}",
    summary="Get a single employee",
    status_code=status.HTTP_200_OK,
)
async def get_employee(
    employee_id: str,
    svc: EmployeeService = Depends(get_service),
):
    employee = await svc.get_employee(employee_id.upper())
    return success_response(data=employee.model_dump())


# ── DELETE /employees/{employee_id} ───────────────────────────────────────────

@router.delete(
    "/{employee_id}",
    summary="Delete an employee (cascades attendance records)",
    status_code=status.HTTP_200_OK,
)
async def delete_employee(
    employee_id: str,
    svc: EmployeeService = Depends(get_service),
):
    result = await svc.delete_employee(employee_id.upper())
    return success_response(
        data=result,
        message=f"Employee '{employee_id}' and their attendance records have been deleted.",
    )
