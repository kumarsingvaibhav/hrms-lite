"""
tests/test_api.py
──────────────────
Integration tests using pytest + httpx async client.

Run with:  pytest tests/ -v
Requires a running MongoDB instance (set MONGODB_URL env var).
Uses a separate test database to avoid polluting real data.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import date

import os
os.environ["MONGODB_DB_NAME"] = "hrms_lite_test"

from app.main import app


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


# ── Health ────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


# ── Employee CRUD ─────────────────────────────────────────────────────────────

SAMPLE_EMP = {
    "employee_id": "TST001",
    "full_name": "Test User",
    "email": "test@example.com",
    "department": "Engineering",
}


@pytest.mark.asyncio
async def test_create_employee(client):
    r = await client.post("/api/v1/employees", json=SAMPLE_EMP)
    assert r.status_code == 201
    data = r.json()
    assert data["success"] is True
    assert data["data"]["employee_id"] == "TST001"


@pytest.mark.asyncio
async def test_create_employee_duplicate_id(client):
    await client.post("/api/v1/employees", json=SAMPLE_EMP)
    r = await client.post("/api/v1/employees", json=SAMPLE_EMP)
    assert r.status_code == 409


@pytest.mark.asyncio
async def test_create_employee_invalid_email(client):
    emp = {**SAMPLE_EMP, "employee_id": "TST002", "email": "not-an-email"}
    r = await client.post("/api/v1/employees", json=emp)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_create_employee_future_date_attendance(client):
    # First create employee
    await client.post("/api/v1/employees", json=SAMPLE_EMP)
    future = str(date.today().replace(year=date.today().year + 1))
    r = await client.post("/api/v1/attendance", json={
        "employee_id": "TST001",
        "date": future,
        "status": "Present",
    })
    assert r.status_code == 422  # caught by Pydantic model validator


@pytest.mark.asyncio
async def test_list_employees(client):
    r = await client.get("/api/v1/employees")
    assert r.status_code == 200
    assert isinstance(r.json()["data"], list)


@pytest.mark.asyncio
async def test_get_employee_not_found(client):
    r = await client.get("/api/v1/employees/NOTEXIST")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_delete_employee(client):
    await client.post("/api/v1/employees", json=SAMPLE_EMP)
    r = await client.delete("/api/v1/employees/TST001")
    assert r.status_code == 200
    assert r.json()["success"] is True


# ── Attendance ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_mark_attendance(client):
    await client.post("/api/v1/employees", json=SAMPLE_EMP)
    r = await client.post("/api/v1/attendance", json={
        "employee_id": "TST001",
        "date": str(date.today()),
        "status": "Present",
    })
    assert r.status_code == 201
    assert r.json()["data"]["status"] == "Present"


@pytest.mark.asyncio
async def test_mark_attendance_duplicate(client):
    await client.post("/api/v1/employees", json=SAMPLE_EMP)
    payload = {"employee_id": "TST001", "date": str(date.today()), "status": "Present"}
    await client.post("/api/v1/attendance", json=payload)
    r = await client.post("/api/v1/attendance", json=payload)
    assert r.status_code == 409


@pytest.mark.asyncio
async def test_get_attendance_history(client):
    await client.post("/api/v1/employees", json=SAMPLE_EMP)
    r = await client.get("/api/v1/attendance/employee/TST001")
    assert r.status_code == 200
    assert isinstance(r.json()["data"], list)


@pytest.mark.asyncio
async def test_dashboard(client):
    r = await client.get("/api/v1/dashboard")
    assert r.status_code == 200
    data = r.json()["data"]
    assert "total_employees" in data
    assert "today" in data
