// src/pages/Inventory/ReturnForm.jsx
import React, { useState } from "react";

const ReturnForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    department: "",
    item: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter department name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Item</label>
        <input
          type="text"
          name="item"
          value={formData.item}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter item name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Return Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Explain reason"
        />
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow"
        >
          Submit Return
        </button>
      </div>
    </form>
  );
};

export default ReturnForm;
