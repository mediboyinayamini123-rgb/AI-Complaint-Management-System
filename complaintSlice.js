import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complaint: {
    complaint_source: "",
    customer_name: "",
    product_name: "",
    product_strength: "",
    batch_lot_number: "",
    manufacturing_date: "",
    expiry_date: "",
    quantity_affected: "",
    complaint_type: "",
    complaint_date: "",
    detailed_description: "",
    initial_severity: "",
    priority: "",
  },

  aiAnalysis: {
    extracted_data: {},
    risk_assessment: {},
    summary: "",
  },

  loading: false,
  status: "PENDING_TRIAGE",
  error: null,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,

  reducers: {
    updateComplaintField: (state, action) => {
      const { field, value } = action.payload;
      state.complaint[field] = value;
    },

    updateComplaint: (state, action) => {
      state.complaint = {
        ...state.complaint,
        ...action.payload,
      };
    },

    setAIAnalysis: (state, action) => {
      state.aiAnalysis = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    resetComplaint: () => initialState,
  },
});

export const {
  updateComplaintField,
  updateComplaint,
  setAIAnalysis,
  setLoading,
  setStatus,
  setError,
  resetComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer;