import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInventoryItems, deleteInventoryItem } from "../../services/inventoryService";

const InventoryByCategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getInventoryItems();
        const filtered = data.filter(
          (item) => item.category.toLowerCase() === categoryName.toLowerCase()
        );
        setItems(filtered);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchItems();
  }, [categoryName]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteInventoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {categoryName} Items
        </h2>
        <button
          onClick={() => navigate("/inventory/add")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <p>No items found for this category.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-white border rounded shadow-sm text-sm"
            >
              <div>
                <strong>{item.name}</strong> — {item.unit}
              </div>
              <div>
                Min: {item.min_level}, Max: {item.max_level}, Barcode: {item.barcode}
              </div>
              <div className="mt-2 space-x-4">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate(`/inventory/edit/${item.id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InventoryByCategory;
