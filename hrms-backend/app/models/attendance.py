from pydantic import BaseModel, Field, field_validator, model_validator
import datetime
from typing import Optional
from enum import Enum


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., description="Must match an existing employee_id")
    date: datetime.date = Field(..., description="Date in YYYY-MM-DD format")
    status: AttendanceStatus = Field(..., description="Present or Absent")

    @field_validator("employee_id")
    @classmethod
    def normalise_employee_id(cls, v: str) -> str:
        return v.strip().upper()

    @model_validator(mode="after")
    def date_not_in_future(self) -> "AttendanceCreate":
        if self.date > datetime.date.today():
            raise ValueError("Attendance date cannot be in the future.")
        return self

    model_config = {
        "json_schema_extra": {
            "example": {
                "employee_id": "EMP001",
                "date": "2025-02-26",
                "status": "Present",
            }
        }
    }


class AttendanceOut(BaseModel):
    id: Optional[str] = None
    employee_id: str
    date: str
    status: str

    @classmethod
    def from_doc(cls, doc: dict) -> "AttendanceOut":
        d = doc.get("date")

        if isinstance(d, datetime.date):
            d = d.isoformat()
        elif isinstance(d, datetime.datetime):
            d = d.date().isoformat()
        else:
            d = str(d)

        return cls(
            id=str(doc.get("_id", "")),
            employee_id=doc["employee_id"],
            date=d,
            status=doc["status"],
        )


class AttendanceSummary(BaseModel):
    employee_id: str
    total_days: int
    present_days: int
    absent_days: int
    attendance_rate: float