from pathlib import Path
from email import policy
from email.parser import BytesParser

from pypdf import PdfReader
from docx import Document


def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    import io

    pdf_file = io.BytesIO(file_bytes)
    reader = PdfReader(pdf_file)

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages)


def extract_text_from_docx(file_bytes: bytes) -> str:
    import io

    docx_file = io.BytesIO(file_bytes)
    document = Document(docx_file)

    paragraphs = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            paragraphs.append(paragraph.text)

    return "\n".join(paragraphs)


def extract_text_from_eml(file_bytes: bytes) -> str:
    import io

    message = BytesParser(
        policy=policy.default
    ).parse(
        io.BytesIO(file_bytes)
    )

    parts = []

    if message["subject"]:
        parts.append(
            f"Subject: {message['subject']}"
        )

    if message["from"]:
        parts.append(
            f"From: {message['from']}"
        )

    if message["to"]:
        parts.append(
            f"To: {message['to']}"
        )

    body = message.get_body(
        preferencelist=("plain", "html")
    )

    if body:
        parts.append(body.get_content())

    return "\n".join(parts)


def extract_text_from_file(
    filename: str,
    file_bytes: bytes
) -> str:

    extension = Path(
        filename
    ).suffix.lower()

    if extension == ".txt":
        return extract_text_from_txt(
            file_bytes
        )

    if extension == ".pdf":
        return extract_text_from_pdf(
            file_bytes
        )

    if extension == ".docx":
        return extract_text_from_docx(
            file_bytes
        )

    if extension == ".eml":
        return extract_text_from_eml(
            file_bytes
        )

    raise ValueError(
        "Unsupported file type. "
        "Please upload PDF, DOCX, TXT, or EML."
    )