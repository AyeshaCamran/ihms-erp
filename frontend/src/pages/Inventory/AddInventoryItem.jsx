import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatISO } from "date-fns";

const AddInventoryItem = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    tag: "",
    type: "",
    customType: "",
    stock_from: "",
    vocno_in: "",
    itemname: "",
    description: "",
    qty: "",
    unit: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8001/inventory/items");
        const uniqueTypes = [...new Set(res.data.map((item) => item.type))];
        setCategories(uniqueTypes);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalType = formData.type === "Other" ? formData.customType : formData.type;
    const now = new Date();

    try {
      await axios.post("http://localhost:8001/inventory/items", {
        tag: formData.tag,
        type: finalType,
        stock_from: formData.stock_from,
        vocno_in: formData.vocno_in,
        vocdate_in: formatISO(now),     // auto-generated ISO datetime
        itemname: formData.itemname,
        description: formData.description,
        qty: parseInt(formData.qty),
        unit: formData.unit,
        created_at: formatISO(now),     // same timestamp
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
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Item Name */}
        <div>
          <label className="block font-medium mb-1">Item Name</label>
          <input
            type="text"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Tag */}
        <div>
          <label className="block font-medium mb-1">Tag</label>
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Type (Category) with "Other" Option */}
        <div>
          <label className="block font-medium mb-1">Category (Type)</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {formData.type === "Other" && (
            <input
              type="text"
              name="customType"
              value={formData.customType}
              onChange={handleChange}
              placeholder="Enter custom category"
              className="mt-2 w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          )}
        </div>

        {/* Stock From */}
        <div>
          <label className="block font-medium mb-1">Stock From</label>
          <input
            type="text"
            name="stock_from"
            value={formData.stock_from}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* VOC No */}
        <div>
          <label className="block font-medium mb-1">VOC No.</label>
          <input
            type="text"
            name="vocno_in"
            value={formData.vocno_in}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            rows={3}
            required
          />
        </div>

        {/* Qty */}
        <div>
          <label className="block font-medium mb-1">Qty in Stock</label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block font-medium mb-1">Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryItem;
