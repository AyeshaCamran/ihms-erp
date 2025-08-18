import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Package, Pencil, Trash2, Funnel} from "lucide-react";
import { useNavigate } from "react-router-dom";


const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedStatus, searchQuery, inventoryItems]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:8001/inventory/items");
      setInventoryItems(res.data);
      const uniqueTypes = [...new Set(res.data.map((item) => item.type))];
      setCategories(uniqueTypes);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const applyFilters = () => {
    let items = [...inventoryItems];

    if (selectedCategory !== "All Category") {
      items = items.filter((item) => item.type === selectedCategory);
    }

    if (selectedStatus !== "All Status") {
      items = items.filter((item) => {
        if (selectedStatus === "Available") return item.qty >= 5;
        if (selectedStatus === "Low") return item.qty > 0 && item.qty < 5;
        if (selectedStatus === "Out of Stock") return item.qty === 0;
        return true;
      });
    }

    if (searchQuery.trim() !== "") {
      items = items.filter((item) =>
        item.itemname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(items);
  };

  const getBadgeClass = (qty) => {
    if (qty === 0) return "bg-[#E6E6E7] text-[#05080B]";
    if (qty < 5) return "bg-[#FFE1E1] text-[#05080B]";
    return "bg-[#DFF8F9] text-[#05080B]";
  };

  const getBadgeText = (qty) => {
    if (qty === 0) return "Out of Stock";
    if (qty < 5) return "Low";
    return "Available";
  };

  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:8001/inventory/items/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory_export.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="p-2 bg-white text-[#05080B]">
      {/* Filters + Buttons */}
      <div className="sticky top-0 z-20 bg-white py-2 flex flex-wrap justify-between items-center gap-4 border-[#E6E6E7]">
        {/* Left Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-transparent text-sm rounded-md pl-10 pr-4 py-2 bg-[#F0F0F0] shadow-sm text-gray-400"
            >
            <option>All Category</option>
            {categories.map((cat, idx) => (
              <option key={idx}>{cat}</option>
            ))}
            </select>
          </div>

          <div className="relative">
            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-transparent text-sm rounded-md pl-10 pr-4 py-2 bg-[#F0F0F0] shadow-sm text-gray-400"
            >
            <option>All Status</option>
            <option>Available</option>
            <option>Low</option>
            <option>Out of Stock</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search item, etc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-transparent text-gray-700 rounded-md bg-[#F0F0F0] shadow-sm"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>

        {/* Right Controls */}
       {/* Right Controls */}
      <div className="flex flex-wrap gap-3 items-center">
            {/* Add Item */}
            <button
              onClick={() => navigate("/inventory/add")}
              className="bg-[#233955] hover:bg-[#1a2a40] text-white text-sm font-semibold px-5 py-2 rounded-md flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Add Item
            </button>

            {/* Import */}
            <button
              onClick={() => alert("Import logic")}
              className="border border-transparent text-sm px-4 py-2 rounded-md bg-[#F0F0F0] hover:bg-[#233955] hover:text-white flex items-center gap-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v16h16V4H4zm8 4v4m0 0l-2-2m2 2l2-2"
                />
              </svg>
              Import
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="border border-transparent text-sm px-4 py-2 rounded-md bg-[#F0F0F0] hover:bg-[#233955] hover:text-white flex items-center gap-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 15V3"
                />
              </svg>
              Export
            </button>
      </div>

      </div>

      {/* Table Container with proper sticky header */}
      <div className="mt-4 relative">
        <div className="overflow-auto bg-white border border-[#E6E6E7] rounded-lg shadow-sm max-h-[calc(100vh-200px)]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F0F0F0] text-[#4B4D4F] font-semibold border-b border-[#E6E6E7] sticky top-0 z-10">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Availability</th>
                <th className="p-3">Qty in Stock</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No matching items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#E6E6E7] hover:bg-[#F9FAFB]">
                    <td className="p-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        <Package size={18} />
                      </div>
                    </td>
                    <td className="p-3 font-medium">{item.itemname}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getBadgeClass(
                          item.qty
                        )}`}
                      >
                        {getBadgeText(item.qty)}
                      </span>
                    </td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        title="Edit"
                        onClick={() => navigate(`/inventory/edit/${item.id}`)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        title="Delete"
                        onClick={() => alert("Delete logic pending")}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Showing <b>{filteredItems.length}</b> out of{" "}
          <b>{inventoryItems.length}</b>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, "...", 10].map((pg, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                pg === 1 ? "bg-[#2563EB] text-white" : "bg-white hover:bg-[#F3F9F9]"
              } border border-[#E6E6E7]`}
            >
              {pg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryList;