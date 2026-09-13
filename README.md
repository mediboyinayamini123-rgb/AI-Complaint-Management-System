# AI-Powered Customer Complaint Management System


An AI-powered Customer Complaint Management System designed for pharmaceutical manufacturing organizations.

The system uses Generative AI to automatically extract complaint information from customer complaint text and documents, assess complaint risk, generate a summary, populate the complaint form, and store the reviewed complaint in a QMS Ledger.

---

## 📌 Project Overview

Pharmaceutical companies receive customer complaints through different channels such as emails, PDF documents, Word documents, and text messages.

Manually reading complaints and entering all the information into a complaint management system can be time-consuming and may lead to data-entry errors.

This project provides an AI-powered solution where the user can upload a complaint document or paste complaint text.

The AI Copilot then:

1. Reads the complaint
2. Extracts important complaint information
3. Automatically populates the complaint form
4. Performs AI-based risk assessment
5. Generates a complaint summary
6. Provides a recommended action
7. Allows the user to review and correct the information
8. Stores the complaint in PostgreSQL
9. Commits the reviewed complaint to the QMS Ledger

The system follows a human-in-the-loop approach where AI-generated information is reviewed by the user before final commitment.

---

# 🎯 Objective

The main objective of this project is to demonstrate how AI can assist pharmaceutical quality teams in managing customer complaints efficiently.

The system converts unstructured complaint information into structured data and provides AI-assisted risk assessment while keeping the final decision under human control.

---

# ✨ Key Features

## 1. AI Complaint Copilot

The AI Copilot allows users to process customer complaints using either:

- Pasted complaint text
- PDF documents
- DOCX documents
- TXT documents
- EML email files

The AI extracts structured information from the complaint.

---

## 2. Automatic Complaint Information Extraction

The AI extracts the following information:

- Customer Name
- Product Name
- Product Strength
- Batch / Lot Number
- Manufacturing Date
- Expiry Date
- Affected Quantity
- Complaint Type
- Complaint Date
- Detailed Description

If information is not available in the complaint, the system returns `null` instead of inventing information.

---

## 3. Document Upload

The system supports:

- PDF
- DOCX
- TXT
- EML

### PDF Processing

PDF text is extracted using `pypdf`.

### DOCX Processing

Microsoft Word document text is extracted using `python-docx`.

### TXT Processing

Text files are decoded and processed directly.

### EML Processing

Email subject, sender, receiver and email body are extracted using Python's email processing functionality.

---

## 4. AI Risk Assessment

After extracting the complaint information, the AI evaluates the complaint and provides:

- Severity
- Priority
- Risk Level
- Recommended Action
- Possible Cause

The supported severity levels are:

- Minor
- Major
- Critical

Example:

```text
Severity: Major
Priority: High
Risk Level: High
```
## 5. AI Complaint Summary

The AI generates a short professional summary of the complaint.

The summary considers:

Customer
Product
Batch
Quantity
Complaint type
Complaint description
Risk assessment

This allows quality personnel to quickly understand the complaint.
```
```
## Technology Stack
Frontend
React
Redux Toolkit
React Redux
Axios
Vite
CSS
Google Inter Font
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Uvicorn
AI
Groq API
LangGraph
Large Language Model
Current Groq Model
openai/gpt-oss-20b

The model is configured through an environment variable so that it can be changed without modifying the application source code.

Database
PostgreSQL
Supabase
Document Processing
pypdf
python-docx
Python email library
## Database

The project uses PostgreSQL hosted through Supabase.

Main table:

complaints

The table stores complaint information and QMS status.
```
```
## End-to-End Workflow
Customer Complaint

       ↓
Upload Document / Paste Text

       ↓
AI Complaint Copilot

       ↓
Document Text Extraction

       ↓
LangGraph Workflow

       ↓
Information Extraction

       ↓
Risk Assessment

       ↓
AI Summary

       ↓
Redux State Update

       ↓
Complaint Form Automatically Populated

       ↓
Human Review

       ↓
Create Complaint

       ↓
PostgreSQL Database

       ↓
Commit to QMS Ledger

       ↓
COMMITTED

