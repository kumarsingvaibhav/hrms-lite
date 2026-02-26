"""
app/models/employee.py
───────────────────────
Pydantic schemas for the Employee domain.

Separation of concerns:
  EmployeeCreate  — incoming request body (validated)
  EmployeeDB      — what we store in / read from MongoDB
  EmployeeOut     — what we return to the client (no internal fields)
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime, timezone
from typing import Optional
import re


# ── Allowed departments ──────────────────────────────────────────────────────

VALID_DEPARTMENTS = {
    "Engineering", "Product", "Design",
    "Operations", "HR", "Finance", "Marketing",
}


# ── Request body ─────────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str = Field(
        ...,
        min_length=2,
        max_length=20,
        description="Unique employee identifier (e.g. EMP001)",
    )
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., description=f"One of: {', '.join(sorted(VALID_DEPARTMENTS))}")

    @field_validator("employee_id")
    @classmethod
    def normalise_employee_id(cls, v: str) -> str:
        v = v.strip().upper()
        if not re.match(r"^[A-Z0-9\-_]+$", v):
            raise ValueError("employee_id may only contain letters, digits, hyphens, and underscores.")
        return v

    @field_validator("full_name")
    @classmethod
    def normalise_full_name(cls, v: str) -> str:
        return " ".join(v.strip().split())

    @field_validator("email")
    @classmethod
    def normalise_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        v = v.strip()
        if v not in VALID_DEPARTMENTS:
            raise ValueError(
                f"'{v}' is not a valid department. Choose from: {', '.join(sorted(VALID_DEPARTMENTS))}"
            )
        return v

    model_config = {"json_schema_extra": {
        "example": {
            "employee_id": "EMP005",
            "full_name": "Riya Kapoor",
            "email": "riya@company.com",
            "department": "Engineering",
        }
    }}


# ── Internal DB document (what Motor returns) ────────────────────────────────

class EmployeeDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


# ── API response shape ────────────────────────────────────────────────────────

class EmployeeOut(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: str          # ISO-8601 string — easier for JS consumers

    @classmethod
    def from_doc(cls, doc: dict) -> "EmployeeOut":
        """Convert a raw MongoDB document → EmployeeOut."""
        created = doc.get("created_at")
        return cls(
            employee_id=doc["employee_id"],
            full_name=doc["full_name"],
            email=doc["email"],
            department=doc["department"],
            created_at=created.isoformat() if isinstance(created, datetime) else str(created),
        )
