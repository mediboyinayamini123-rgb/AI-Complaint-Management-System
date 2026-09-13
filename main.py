from ai_routes import router as ai_router
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from complaint_routes import router as complaint_router


app = FastAPI(
    title="AIVOA Complaint Management API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(complaint_router)
app.include_router(ai_router)


@app.get("/")
def root():

    return {
        "message": "AIVOA Complaint Management API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.get("/database-test")
def database_test(
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("SELECT 1")
    )

    return {
        "database": "connected",
        "result": result.scalar()
    }