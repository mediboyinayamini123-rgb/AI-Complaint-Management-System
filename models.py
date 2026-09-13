from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    Numeric,
    Date,
    DateTime
)

from sqlalchemy.sql import func

from database import Base


class Complaint(Base):

    __tablename__ = "complaints"

    id = Column(BigInteger, primary_key=True, index=True)

    complaint_source = Column(String(100))
    customer_name = Column(String(200))

    product_name = Column(String(200))
    product_strength = Column(String(100))
    batch_lot_number = Column(String(100))

    manufacturing_date = Column(Date)
    expiry_date = Column(Date)
    quantity_affected = Column(Numeric(10, 2))

    complaint_type = Column(String(200))
    complaint_date = Column(Date)
    detailed_description = Column(Text)

    initial_severity = Column(String(50))
    priority = Column(String(50))

    ai_summary = Column(Text)
    ai_risk_level = Column(String(50))

    status = Column(String(50))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    committed_at = Column(
        DateTime(timezone=True)
    )