import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateComplaintField,
  setStatus,
  setError,
} from "../store/complaintSlice";

import {
  createComplaint,
  commitComplaint,
} from "../services/api";


function ComplaintForm() {
  const dispatch = useDispatch();

  const complaint = useSelector(
    (state) => state.complaint.complaint
  );

  const status = useSelector(
    (state) => state.complaint.status
  );

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] =
    useState("");


  const handleChange = (field, value) => {
    dispatch(
      updateComplaintField({
        field,
        value,
      })
    );
  };


  /*
    Convert the frontend complaint data
    into the format expected by FastAPI.
  */
  const prepareComplaintData = () => {
    return {
      complaint_source:
        complaint.complaint_source || null,

      customer_name:
        complaint.customer_name || null,

      product_name:
        complaint.product_name || null,

      product_strength:
        complaint.product_strength || null,

      batch_lot_number:
        complaint.batch_lot_number || null,

      manufacturing_date:
        complaint.manufacturing_date || null,

      expiry_date:
        complaint.expiry_date || null,

      /*
        Extract only the numeric quantity.
        Example:
        "48 capsules" → 48
      */
      quantity_affected:
        complaint.quantity_affected
          ? parseFloat(
              String(
                complaint.quantity_affected
              ).match(/[\d.]+/)?.[0] || 0
            )
          : null,

      complaint_type:
        complaint.complaint_type || null,

      complaint_date:
        complaint.complaint_date || null,

      detailed_description:
        complaint.detailed_description || null,

      initial_severity:
        complaint.initial_severity || null,

      priority:
        complaint.priority || null,
    };
  };


  /*
    Save complaint and commit it to QMS Ledger.
  */
  const handleCommit = async () => {

    setSuccessMessage("");
    dispatch(setError(null));


    // Basic validation
    if (!complaint.customer_name) {
      dispatch(
        setError(
          "Customer name is required before committing."
        )
      );

      return;
    }


    if (!complaint.product_name) {
      dispatch(
        setError(
          "Product name is required before committing."
        )
      );

      return;
    }


    try {

      setSaving(true);


      /*
        First create the complaint
        in the database.
      */
      const complaintData =
        prepareComplaintData();


      const createResult =
        await createComplaint(
          complaintData
        );


      const complaintId =
        createResult.complaint_id;


      /*
        Then commit it to the QMS Ledger.
      */
      const commitResult =
        await commitComplaint(
          complaintId
        );


      dispatch(
        setStatus(
          commitResult.status
        )
      );


      setSuccessMessage(
        `Complaint #${complaintId} committed to QMS Ledger successfully.`
      );


    } catch (error) {

      console.error(error);

      dispatch(
        setError(
          error.response?.data?.detail ||
            "Unable to commit complaint."
        )
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <div className="complaint-form">

      {/* ================================
          Origin & Customer Details
      ================================= */}

      <div className="form-section">

        <h3>
          Origin & Customer Details
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Complaint Source
            </label>

            <input
              type="text"
              value={
                complaint.complaint_source
              }
              onChange={(e) =>
                handleChange(
                  "complaint_source",
                  e.target.value
                )
              }
              placeholder="e.g. Email, Phone, Portal"
            />

          </div>


          <div className="form-group">

            <label>
              Customer Name
            </label>

            <input
              type="text"
              value={
                complaint.customer_name
              }
              onChange={(e) =>
                handleChange(
                  "customer_name",
                  e.target.value
                )
              }
              placeholder="Customer name"
            />

          </div>

        </div>

      </div>


      {/* ================================
          Product & Batch Identification
      ================================= */}

      <div className="form-section">

        <h3>
          Product & Batch Identification
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              value={
                complaint.product_name
              }
              onChange={(e) =>
                handleChange(
                  "product_name",
                  e.target.value
                )
              }
              placeholder="Product name"
            />

          </div>


          <div className="form-group">

            <label>
              Product Strength
            </label>

            <input
              type="text"
              value={
                complaint.product_strength
              }
              onChange={(e) =>
                handleChange(
                  "product_strength",
                  e.target.value
                )
              }
              placeholder="e.g. 500 mg"
            />

          </div>


          <div className="form-group">

            <label>
              Batch / Lot Number
            </label>

            <input
              type="text"
              value={
                complaint.batch_lot_number
              }
              onChange={(e) =>
                handleChange(
                  "batch_lot_number",
                  e.target.value
                )
              }
              placeholder="Batch number"
            />

          </div>


          <div className="form-group">

            <label>
              Affected Quantity
            </label>

            <input
              type="text"
              value={
                complaint.quantity_affected
              }
              onChange={(e) =>
                handleChange(
                  "quantity_affected",
                  e.target.value
                )
              }
              placeholder="e.g. 48 capsules"
            />

          </div>


          <div className="form-group">

            <label>
              Manufacturing Date
            </label>

            <input
              type="date"
              value={
                complaint.manufacturing_date
              }
              onChange={(e) =>
                handleChange(
                  "manufacturing_date",
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Expiry Date
            </label>

            <input
              type="date"
              value={
                complaint.expiry_date
              }
              onChange={(e) =>
                handleChange(
                  "expiry_date",
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>


      {/* ================================
          Complaint Details
      ================================= */}

      <div className="form-section">

        <h3>
          Complaint Details
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Complaint Type
            </label>

            <input
              type="text"
              value={
                complaint.complaint_type
              }
              onChange={(e) =>
                handleChange(
                  "complaint_type",
                  e.target.value
                )
              }
              placeholder="Type of complaint"
            />

          </div>


          <div className="form-group">

            <label>
              Complaint Date
            </label>

            <input
              type="date"
              value={
                complaint.complaint_date
              }
              onChange={(e) =>
                handleChange(
                  "complaint_date",
                  e.target.value
                )
              }
            />

          </div>

        </div>


        <div className="form-group">

          <label>
            Detailed Description
          </label>

          <textarea
            rows="5"
            value={
              complaint.detailed_description
            }
            onChange={(e) =>
              handleChange(
                "detailed_description",
                e.target.value
              )
            }
            placeholder="Describe the customer complaint..."
          />

        </div>

      </div>


      {/* ================================
          Initial Assessment
      ================================= */}

      <div className="form-section">

        <h3>
          Initial Assessment & Priority
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Initial Severity
            </label>

            <select
              value={
                complaint.initial_severity
              }
              onChange={(e) =>
                handleChange(
                  "initial_severity",
                  e.target.value
                )
              }
            >

              <option value="">
                Select severity
              </option>

              <option value="Minor">
                Minor
              </option>

              <option value="Major">
                Major
              </option>

              <option value="Critical">
                Critical
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Priority
            </label>

            <select
              value={
                complaint.priority
              }
              onChange={(e) =>
                handleChange(
                  "priority",
                  e.target.value
                )
              }
            >

              <option value="">
                Select priority
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* ================================
          QMS Commit
      ================================= */}

      <div className="qms-commit-section">

        <div className="qms-status">

          <span>
            Status
          </span>

          <strong>
            {status}
          </strong>

        </div>


        <button
          type="button"
          className="commit-button"
          onClick={handleCommit}
          disabled={
            saving ||
            status === "COMMITTED"
          }
        >

          {saving
            ? "Committing..."
            : status === "COMMITTED"
            ? "Committed to QMS Ledger"
            : "Commit to QMS Ledger"}

        </button>


        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

      </div>

    </div>
  );
}


export default ComplaintForm;