from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Endpoint for monitoring uptime and Render health checks.",
)
def get_health() -> HealthResponse:
    """Return health status of the application."""
    return HealthResponse(status="ok")
