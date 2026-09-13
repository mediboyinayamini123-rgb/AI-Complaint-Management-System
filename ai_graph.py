import os
import json

from dotenv import load_dotenv
from groq import Groq
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


class ComplaintState(TypedDict):
    complaint_text: str
    extracted_data: dict
    risk_assessment: dict
    summary: str


def extract_complaint(state: ComplaintState):
    prompt = f"""
You are an AI assistant for a pharmaceutical customer complaint
management system.

Extract the following information from the complaint.

Return ONLY valid JSON.

Fields:
- customer_name
- product_name
- product_strength
- batch_lot_number
- manufacturing_date
- expiry_date
- quantity_affected
- complaint_type
- complaint_date
- detailed_description

If a field is not available, use null.

Complaint:
{state["complaint_text"]}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You extract structured information from pharmaceutical complaints."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    # Remove markdown code fences if the model adds them
    content = content.replace("```json", "").replace("```", "").strip()

    extracted = json.loads(content)

    return {
        "extracted_data": extracted
    }


def assess_risk(state: ComplaintState):
    complaint = state["complaint_text"]
    extracted = state["extracted_data"]

    prompt = f"""
You are a pharmaceutical quality complaint risk assessment assistant.

Analyze this complaint and classify its risk.

Return ONLY valid JSON with these fields:

- severity
- priority
- risk_level
- recommended_action
- possible_cause

Use these severity levels:
Minor, Major, Critical

Complaint:
{complaint}

Extracted information:
{json.dumps(extracted)}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a pharmaceutical quality risk assessment assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content
    content = content.replace("```json", "").replace("```", "").strip()

    risk = json.loads(content)

    return {
        "risk_assessment": risk
    }


def generate_summary(state: ComplaintState):
    prompt = f"""
Create a short professional summary of this pharmaceutical complaint.

Complaint:
{state["complaint_text"]}

Extracted information:
{json.dumps(state["extracted_data"])}

Risk assessment:
{json.dumps(state["risk_assessment"])}

Return only the summary text.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You summarize pharmaceutical customer complaints clearly."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return {
        "summary": response.choices[0].message.content.strip()
    }


# Create LangGraph
graph = StateGraph(ComplaintState)

graph.add_node("extract_complaint", extract_complaint)
graph.add_node("assess_risk", assess_risk)
graph.add_node("generate_summary", generate_summary)

graph.add_edge(START, "extract_complaint")
graph.add_edge("extract_complaint", "assess_risk")
graph.add_edge("assess_risk", "generate_summary")
graph.add_edge("generate_summary", END)

complaint_graph = graph.compile()