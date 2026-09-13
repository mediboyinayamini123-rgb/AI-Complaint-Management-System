import axios from "axios";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


/*
  Analyze complaint using pasted text
*/
export const analyzeComplaint = async (complaintText) => {
  const response = await API.post(
    "/ai/analyze",
    {
      complaint_text: complaintText,
    }
  );

  return response.data;
};


/*
  Analyze uploaded complaint document
*/
export const analyzeComplaintFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post(
    "/ai/analyze-file",
    formData
  );

  return response.data;
};


/*
  Create complaint in the QMS database
*/
export const createComplaint = async (complaint) => {
  const response = await API.post(
    "/complaints/",
    complaint
  );

  return response.data;
};


/*
  Commit an existing complaint to the QMS Ledger
*/
export const commitComplaint = async (complaintId) => {
  const response = await API.post(
    `/complaints/${complaintId}/commit`
  );

  return response.data;
};


export default API;