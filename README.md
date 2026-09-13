# AI-Powered Customer Complaint Management System

An AI-powered Customer Complaint Management System designed for pharmaceutical manufacturing organizations.

The system uses Artificial Intelligence to analyze customer complaints, automatically extract important complaint information, assess risk, generate a summary, and prepare the complaint for submission to a QMS (Quality Management System) Ledger.

---

## 🚀 Project Overview

Pharmaceutical companies receive customer complaints through different channels such as emails, documents, and other communication methods.

Manually reviewing these complaints and entering information into a quality management system can be time-consuming and error-prone.

This project provides an AI-powered solution that:

- Accepts complaint text or complaint documents
- Extracts important complaint information automatically
- Populates the complaint form using AI
- Performs AI-based risk assessment
- Generates a complaint summary
- Recommends appropriate actions
- Allows human review before submission
- Commits the complaint to a QMS Ledger
- Stores complaint information in a PostgreSQL database

---

## ✨ Features

### 1. AI Complaint Copilot

The AI Complaint Copilot allows users to analyze customer complaints using either:

- Pasted complaint text
- PDF files
- DOCX files
- TXT files
- EML files

---

### 2. Automatic Information Extraction

The AI extracts important complaint information including:

- Customer Name
- Product Name
- Product Strength
- Batch / Lot Number
- Manufacturing Date
- Expiry Date
- Affected Quantity
- Complaint Type
- Complaint Date
- Detailed Complaint Description

The extracted information is automatically populated into the complaint form.

---

### 3. AI Risk Assessment

The system analyzes the complaint and provides:

- Severity
- Priority
- Risk Level
- Recommended Action
- Possible Cause

Severity levels include:

- Minor
- Major
- Critical

---

### 4. AI Complaint Summary

The system generates a short professional summary of the complaint using the extracted information and risk assessment.

---

### 5. Human Review

AI-generated information can be reviewed and corrected by the user before committing the complaint.

This keeps a human in the decision-making loop for quality-related processes.

---

### 6. QMS Ledger Commit

After reviewing the complaint, the user can click:

**Commit to QMS Ledger**

The complaint is stored in the PostgreSQL database and its status is changed to:

`COMMITTED`

---

### 7. Database Storage

Complaint information is stored in PostgreSQL using Supabase.

The database stores:

- Complaint information
- AI summary
- Risk information
- Complaint status
- Creation timestamp
- Commit timestamp

---

## 🏗️ System Architecture

```text
                    User
                      |
                      v
          +-----------------------+
          |     React Frontend    |
          |       + Redux         |
          +-----------+-----------+
                      |
                      | HTTP / REST API
                      v
          +-----------------------+
          |     FastAPI Backend   |
          +-----------+-----------+
                      |
             +--------+--------+
             |                 |
             v                 v
     +---------------+   +-------------+
     | File Text     |   | PostgreSQL  |
     | Extraction    |   | / Supabase  |
     +-------+-------+   +-------------+
             |
             v
        +------------+
        | LangGraph  |
        | AI Workflow|
        +-----+------+
              |
              v
        +------------+
        | Groq LLM   |
        +------------+
              |
              v
       AI Analysis Result
              |
              v
       React + Redux
              |
              v
       Complaint Form
