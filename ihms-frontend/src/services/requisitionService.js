// src/services/requisitionService.js
import axios from "axios";
const BASE_URL = "http://localhost:8001/inventory"; // Adjust based on backend

export const submitRequisition = async (data) => {
  return axios.post(`${BASE_URL}/inventory/requisition`, data);
};

// export const submitReturn = async (data) => {
//   return axios.post(`${BASE_URL}/inventory/requisition/return`, data);
// };
