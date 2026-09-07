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

# Explicit allowed origins including Render frontend and local development
allowed_origins = [
    "https://codeforge-0j8e.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Merge any extra origins from settings
for o in settings.CORS_ORIGINS:
    if o not in allowed_origins and o != "*":
        allowed_origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^(https?:\/\/.*\.onrender\.com|http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=0,  # Prevent browsers from caching stale preflights during hackathon iterations
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
