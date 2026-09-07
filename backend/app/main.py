from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.database import init_db
from app.routers import health_router, items_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown events."""
    # Ensure database tables exist
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Universal CORS for hackathon API - allows any origin, header, and method
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)

# Include Routers
app.include_router(health_router)
app.include_router(items_router, prefix="/api/v1/items", tags=["Items"])


@app.get("/", tags=["Root"])
def root_endpoint():
    """Root endpoint for quick API discovery."""
    return {
        "message": "Codeforge Hackathon API is running",
        "status": "ok",
        "docs": "/docs",
        "health": "/health",
        "version": settings.VERSION,
    }
