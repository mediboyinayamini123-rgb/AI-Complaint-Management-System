from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Complaint
from schemas import ComplaintCreate


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


# ---------------------------------------
# Create a complaint
# ---------------------------------------

@router.post("/")
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db)
):
    new_complaint = Complaint(
        **complaint.model_dump(),
        status="PENDING_TRIAGE"
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return {
        "message": "Complaint created successfully",
        "complaint_id": new_complaint.id,
        "status": new_complaint.status
    }


# ---------------------------------------
# Commit complaint to QMS Ledger
# ---------------------------------------

@router.post("/{complaint_id}/commit")
def commit_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )


    # Prevent duplicate commits
    if complaint.status == "COMMITTED":
        return {
            "message": "Complaint is already committed",
            "complaint_id": complaint.id,
            "status": complaint.status,
            "committed_at": complaint.committed_at
        }


    # Mark complaint as committed
    complaint.status = "COMMITTED"

    complaint.committed_at = datetime.now(
        timezone.utc
    )


    db.commit()
    db.refresh(complaint)


    return {
        "message": "Complaint committed to QMS Ledger successfully",
        "complaint_id": complaint.id,
        "status": complaint.status,
        "committed_at": complaint.committed_at
    }