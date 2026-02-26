"""
app/main.py
────────────
FastAPI application factory.

Responsibilities:
  - Create and configure the FastAPI app
  - Register lifespan (DB connect / disconnect)
  - Add CORS middleware
  - Register exception handlers
  - Mount all routers under /api/v1
  - Expose /health endpoint
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
    RequestLoggingMiddleware,
)
from app.routes import employees, attendance, dashboard


# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("hrms.main")


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup → connect DB; Shutdown → disconnect DB."""
    await connect_db()
    yield
    await disconnect_db()


# ── App factory ───────────────────────────────────────────────────────────────

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "HRMS Lite — lightweight HR management system. "
            "Manage employees and track daily attendance."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Request logging (dev) ─────────────────────────────────────────────────
    if settings.DEBUG:
        app.add_middleware(RequestLoggingMiddleware)

    # ── Exception handlers ────────────────────────────────────────────────────
    from fastapi import HTTPException
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    # ── Routers ───────────────────────────────────────────────────────────────
    PREFIX = "/api/v1"
    app.include_router(dashboard.router, prefix=PREFIX)
    app.include_router(employees.router, prefix=PREFIX)
    app.include_router(attendance.router, prefix=PREFIX)

    # ── Health check ──────────────────────────────────────────────────────────
    @app.get("/health", tags=["Health"])
    async def health():
        return {
            "status": "ok",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }

    @app.get("/", tags=["Health"])
    async def root():
        return {
            "message": f"Welcome to {settings.APP_NAME} API",
            "docs": "/docs",
            "version": settings.APP_VERSION,
        }

    logger.info("%s v%s started. Docs at /docs", settings.APP_NAME, settings.APP_VERSION)
    return app


# ── Export ────────────────────────────────────────────────────────────────────

app = create_app()
