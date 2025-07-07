// src/pages/Inventory/EditInventoryItem.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditInventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8001/inventory/items/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Fetch item failed:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8001/inventory/items/${id}`, {
        ...formData,
        min_level: parseInt(formData.min_level),
        max_level: parseInt(formData.max_level),
      });
      alert("Item updated successfully!");
      navigate("/inventory");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed!");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Inventory Item</h2>
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
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditInventoryItem;
