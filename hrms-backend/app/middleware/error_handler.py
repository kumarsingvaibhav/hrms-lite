"""
app/middleware/error_handler.py
────────────────────────────────
Centralised exception handling.

Maps:
  RequestValidationError  → 422  (Pydantic validation failures)
  HTTPException           → as-is (our own raises from services/routes)
  Exception               → 500  (unexpected errors)

All responses follow the standard envelope:
  { "success": false, "message": "...", "data": null }
"""

import logging
import traceback

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("hrms.error_handler")


# ── Exception handler registrations (used in main.py) ────────────────────────

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": None,
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Flatten Pydantic v2 validation errors into a readable message list.
    """
    errors = []
    for err in exc.errors():
        loc = " → ".join(str(l) for l in err.get("loc", []) if l != "body")
        msg = err.get("msg", "Invalid value")
        errors.append(f"{loc}: {msg}" if loc else msg)

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed.",
            "data": {"errors": errors},
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        "Unhandled exception on %s %s\n%s",
        request.method,
        request.url.path,
        traceback.format_exc(),
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred. Please try again later.",
            "data": None,
        },
    )


# ── Optional request logging middleware ──────────────────────────────────────

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info("→ %s %s", request.method, request.url.path)
        response = await call_next(request)
        logger.info("← %s %s %d", request.method, request.url.path, response.status_code)
        return response
