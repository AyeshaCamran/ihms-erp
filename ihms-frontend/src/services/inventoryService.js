// src/services/inventoryService.js
import axios from "axios";

const API_BASE_URL = "/inventory";

export const getInventoryItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch inventory items:", error);
    throw error;
  }
};
// Delete an inventory item by ID
export const deleteInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8001/inventory/items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    throw error;
  }
};

