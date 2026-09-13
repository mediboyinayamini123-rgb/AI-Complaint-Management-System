
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from ai_graph import complaint_graph
from file_extractor import extract_text_from_file


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AnalyzeRequest(BaseModel):
    complaint_text: str


def run_ai_analysis(complaint_text: str):

    result = complaint_graph.invoke({
        "complaint_text": complaint_text,
        "extracted_data": {},
        "risk_assessment": {},
        "summary": ""
    })

    return {
        "extracted_data": result["extracted_data"],
        "risk_assessment": result["risk_assessment"],
        "summary": result["summary"]
    }


@router.post("/analyze")
def analyze_complaint(
    request: AnalyzeRequest
):

    if not request.complaint_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Complaint text cannot be empty."
        )

    return run_ai_analysis(
        request.complaint_text
    )


@router.post("/analyze-file")
async def analyze_complaint_file(
    file: UploadFile = File(...)
):

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".eml"
    }

    filename = file.filename or ""
    extension = "." + filename.split(".")[-1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Please upload PDF, DOCX, TXT, or EML."
            )
        )

    try:

        file_bytes = await file.read()

        complaint_text = extract_text_from_file(
            filename,
            file_bytes
        )

        if not complaint_text.strip():
            raise HTTPException(
                status_code=400,
                detail=(
                    "No readable text was found "
                    "in the uploaded document."
                )
            )

        result = run_ai_analysis(
            complaint_text
        )

        return {
            "filename": filename,
            "extracted_text": complaint_text,
            "extracted_data":
                result["extracted_data"],
            "risk_assessment":
                result["risk_assessment"],
            "summary":
                result["summary"]
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            f"File processing error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process the uploaded file."
            )
        )