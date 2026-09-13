import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  analyzeComplaint,
  analyzeComplaintFile,
} from "../services/api";

import {
  setAIAnalysis,
  setLoading,
  setError,
  updateComplaint,
} from "../store/complaintSlice";


function normalizeDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  if (/^\d{4}-\d{2}$/.test(dateValue)) {
    return `${dateValue}-01`;
  }

  const months = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const match = String(dateValue)
    .trim()
    .toLowerCase()
    .match(
      /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})$/
    );

  if (match) {
    const month = months[match[1]];
    const year = match[2];

    return `${year}-${month}-01`;
  }

  return "";
}


function mapAIDataToComplaint(
  extractedData,
  riskAssessment
) {
  return {
    customer_name:
      extractedData.customer_name || "",

    product_name:
      extractedData.product_name || "",

    product_strength:
      extractedData.product_strength || "",

    batch_lot_number:
      extractedData.batch_lot_number || "",

    quantity_affected:
      extractedData.quantity_affected || "",

    manufacturing_date:
      normalizeDate(
        extractedData.manufacturing_date
      ),

    expiry_date:
      normalizeDate(
        extractedData.expiry_date
      ),

    complaint_type:
      extractedData.complaint_type || "",

    complaint_date:
      normalizeDate(
        extractedData.complaint_date
      ),

    detailed_description:
      extractedData.detailed_description || "",

    initial_severity:
      riskAssessment.severity || "",

    priority:
      riskAssessment.priority || "",

    complaint_source:
      "AI Copilot",
  };
}


function AIAssistant() {
  const [complaintText, setComplaintText] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const dispatch = useDispatch();

  const {
    aiAnalysis,
    loading,
    error,
  } = useSelector(
    (state) => state.complaint
  );


  const processAIResult = (result) => {
    dispatch(
      setAIAnalysis(result)
    );

    const extractedData =
      result.extracted_data || {};

    const riskAssessment =
      result.risk_assessment || {};

    const complaintFields =
      mapAIDataToComplaint(
        extractedData,
        riskAssessment
      );

    dispatch(
      updateComplaint(
        complaintFields
      )
    );
  };


  const handleAnalyzeText = async () => {

    if (!complaintText.trim()) {
      dispatch(
        setError(
          "Please enter a complaint before analyzing."
        )
      );

      return;
    }

    try {

      dispatch(setLoading(true));
      dispatch(setError(null));

      const result =
        await analyzeComplaint(
          complaintText
        );

      processAIResult(result);

    } catch (err) {

      console.error(err);

      dispatch(
        setError(
          err.response?.data?.detail ||
            "Unable to analyze the complaint."
        )
      );

    } finally {

      dispatch(setLoading(false));

    }
  };


  const handleFileChange = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      ".pdf",
      ".docx",
      ".txt",
      ".eml",
    ];

    const fileName =
      file.name.toLowerCase();

    const isAllowed =
      allowedTypes.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (!isAllowed) {

      dispatch(
        setError(
          "Please upload a PDF, DOCX, TXT, or EML file."
        )
      );

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);

    dispatch(setError(null));
  };


  const handleAnalyzeFile = async () => {

    if (!selectedFile) {

      dispatch(
        setError(
          "Please select a complaint document first."
        )
      );

      return;
    }

    try {

      dispatch(setLoading(true));
      dispatch(setError(null));

      const result =
        await analyzeComplaintFile(
          selectedFile
        );

      processAIResult(result);

    } catch (err) {

      console.error(err);

      dispatch(
        setError(
          err.response?.data?.detail ||
            "Unable to process the uploaded document."
        )
      );

    } finally {

      dispatch(setLoading(false));

    }
  };


  return (
    <div className="ai-assistant">

      <div className="ai-intro">

        <div className="ai-icon">
          ✦
        </div>

        <div>

          <h3>
            AI Complaint Copilot
          </h3>

          <p>
            Upload a complaint document or paste
            complaint text. AI will extract the
            information and assess the risk.
          </p>

        </div>

      </div>


      {/* Document Upload */}

      <div className="file-upload-section">

        <label>
          Upload Complaint Document
        </label>

        <div className="file-upload-box">

          <input
            id="complaint-file"
            type="file"
            accept=".pdf,.docx,.txt,.eml"
            onChange={handleFileChange}
          />

          <label
            htmlFor="complaint-file"
            className="file-upload-button"
          >
            📎 Choose Document
          </label>

          <span className="file-name">

            {selectedFile
              ? selectedFile.name
              : "PDF, DOCX, TXT or EML"}

          </span>

        </div>


        {selectedFile && (
          <button
            type="button"
            className="file-analyze-button"
            onClick={handleAnalyzeFile}
            disabled={loading}
          >

            {loading
              ? "Processing Document..."
              : "Analyze Uploaded Document"}

          </button>
        )}

      </div>


      <div className="or-divider">

        <span>
          OR
        </span>

      </div>


      {/* Text Input */}

      <div className="copilot-input">

        <label>
          Paste Complaint Text
        </label>

        <textarea
          rows="10"
          value={complaintText}
          onChange={(e) =>
            setComplaintText(
              e.target.value
            )
          }
          placeholder="Paste the customer complaint here..."
        />

      </div>


      <button
        className="analyze-button"
        onClick={handleAnalyzeText}
        disabled={loading}
      >

        {loading
          ? "Analyzing..."
          : "Analyze Complaint"}

      </button>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {aiAnalysis.summary && (
        <div className="ai-results">

          <div className="result-section">

            <h3>
              AI Summary
            </h3>

            <p>
              {aiAnalysis.summary}
            </p>

          </div>


          <div className="result-section">

            <h3>
              Risk Assessment
            </h3>

            <div className="risk-grid">

              <div className="risk-item">

                <span>
                  Severity
                </span>

                <strong>
                  {aiAnalysis
                    .risk_assessment
                    ?.severity || "-"}
                </strong>

              </div>


              <div className="risk-item">

                <span>
                  Priority
                </span>

                <strong>
                  {aiAnalysis
                    .risk_assessment
                    ?.priority || "-"}
                </strong>

              </div>


              <div className="risk-item">

                <span>
                  Risk Level
                </span>

                <strong>
                  {aiAnalysis
                    .risk_assessment
                    ?.risk_level || "-"}
                </strong>

              </div>

            </div>

          </div>


          <div className="result-section">

            <h3>
              Recommended Action
            </h3>

            <p>
              {aiAnalysis
                .risk_assessment
                ?.recommended_action || "-"}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}


export default AIAssistant;