// src/pages/Inventory/AddInventoryItem.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddInventoryItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    min_level: "",
    max_level: "",
    barcode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8001/inventory/items", {
        ...formData,
        min_level: parseInt(formData.min_level),
        max_level: parseInt(formData.max_level),
      });
      alert("Inventory item added successfully!");
      navigate("/inventory");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Name", name: "name" },
          { label: "Category", name: "category" },
          { label: "Unit", name: "unit" },
          { label: "Min Level", name: "min_level", type: "number" },
          { label: "Max Level", name: "max_level", type: "number" },
          { label: "Barcode", name: "barcode" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddInventoryItem;
