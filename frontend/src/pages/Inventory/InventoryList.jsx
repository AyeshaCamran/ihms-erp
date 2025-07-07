// src/pages/Inventory/InventoryList.jsx
import React, { useEffect, useState } from "react";
import { getInventoryItems } from "../../services/inventoryService";
import { deleteInventoryItem } from "../../services/inventoryService";
import { Link } from "react-router-dom";


const InventoryList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
  const fetchItems = async () => {
    try {
      const data = await getInventoryItems();
      console.log("Fetched data:", data);  // 👈 Check browser console
      setItems(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };
  fetchItems();
}, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>
      {items.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="p-4 border rounded shadow-sm">
  <strong>{item.name}</strong> — {item.category} ({item.unit})<br />
  Min Level: {item.min_level}, Max Level: {item.max_level}<br />
  Barcode: {item.barcode}
  <div className="mt-2 space-x-4">
    <Link
      to={`/inventory/edit/${item.id}`}
      className="text-blue-600 hover:underline text-sm"
    >
      ✏️ Edit
    </Link>
    <button
      onClick={async () => {
        const confirm = window.confirm("Are you sure you want to delete this item?");
        if (!confirm) return;
        try {
          await deleteInventoryItem(item.id);
          alert("Item deleted successfully.");
          setItems((prev) => prev.filter((i) => i.id !== item.id));
        } catch (err) {
          alert("Delete failed.");
        }
      }}
      className="text-red-600 hover:underline text-sm"
    >
      🗑️ Delete
    </button>
  </div>
</li>


          ))}
        </ul>
      )}
      <Link
        to="/inventory/add"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add Item
      </Link>
    </div>
  );
};
    
export default InventoryList;
