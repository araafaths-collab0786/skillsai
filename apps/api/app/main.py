"""
SkillLens AI - FastAPI Application Entrypoint
Aligned with SDG 8: Decent Work & Economic Growth
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
from app.core.config import settings
from app.db.mongodb import db_manager
from app.api.v1.auth import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await db_manager.connect()
    yield
    # Shutdown: Disconnect from MongoDB
    await db_manager.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Resume–Job Skill Matching & Gap Analyzer with OpenCV intake, ESCO normalization, and evidence-weighted readiness scoring.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware with strict allowlist (no wildcards with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Standardized envelope middleware
@app.middleware("http")
async def add_process_time_and_envelope(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Mount API V1 Routers
app.include_router(auth_router, prefix="/api/v1")

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "data": {
            "status": "healthy",
            "service": "SkillLens AI API",
            "sdg": "SDG 8 (Decent Work and Economic Growth)",
            "env": settings.APP_ENV,
        },
        "error": None,
        "meta": {
            "timestamp": str(time.time()),
            "version": "1.0.0",
        }
    }

@app.get("/api/v1/ping", tags=["System"])
async def ping():
    return {
        "data": {"pong": True},
        "error": None,
        "meta": {
            "timestamp": str(time.time()),
            "version": "1.0.0",
        }
    }
