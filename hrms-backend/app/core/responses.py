"""
app/core/responses.py
──────────────────────
Standardised JSON response envelopes and HTTP exception shortcuts.

Every API response follows the shape:
  { "success": bool, "message": str, "data": Any | None }
"""

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from typing import Any


# ── Response builders ────────────────────────────────────────────────────────

def success_response(
    data: Any = None,
    message: str = "OK",
    status_code: int = 200,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": True, "message": message, "data": data},
    )


def created_response(data: Any = None, message: str = "Created successfully") -> JSONResponse:
    return success_response(data=data, message=message, status_code=201)


def error_response(message: str, status_code: int = 400) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "message": message, "data": None},
    )


# ── HTTP exception shortcuts ─────────────────────────────────────────────────

def bad_request(detail: str) -> HTTPException:
    return HTTPException(status_code=400, detail=detail)


def not_found(detail: str = "Resource not found") -> HTTPException:
    return HTTPException(status_code=404, detail=detail)


def conflict(detail: str) -> HTTPException:
    return HTTPException(status_code=409, detail=detail)


def internal_error(detail: str = "Internal server error") -> HTTPException:
    return HTTPException(status_code=500, detail=detail)
