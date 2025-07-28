import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; 

const RequisitionPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("All");

  const statusTabs = [
    { label: "All", count: 128 },
    { label: "Approved", count: 98 },
    { label: "Pending", count: 18 },
    { label: "Rejected", count: 12 },
  ];

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    try {
      const res = await fetch("http://localhost:8001/inventory/requisition");
      const data = await res.json();
      setRequisitions(data);
    } catch (error) {
      console.error("Failed to fetch requisitions", error);
    }
  };

  return (
    <div className="w-full px-2 sm:px-2 lg:px-2 py-2">
      
      {/* Top bar with sticky positioning and higher z-index */}
      <div className="sticky top-0 z-20 bg-white pb-4 flex items-center justify-between flex-nowrap w-full mb-4 gap-3 overflow-x-auto whitespace-nowrap">
        
        <div className="flex items-center gap-3">
          
          {/* Status Tabs */}
          <div className="flex gap-1 rounded-md bg-[#F0F0F0] p-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveStatus(tab.label)}
                className={`px-4 py-1 text-sm rounded-md font-medium ${
                  activeStatus === tab.label
                    ? "bg-[#233955] text-white"
                    : "text-gray-600 hover:text-[#233955]"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="flex items-center rounded-md bg-[#F0F0F0] px-4 py-2 text-sm text-gray-500 w-[240px]">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* "+ New Request" button now aligns far right */}
        <button
          onClick={() => navigate("/inventory/requisition/request")}
          className="bg-[#233955] hover:bg-[#1a2a40] text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
        >
          + New Request
        </button>
      </div>

      {/* Table Container with proper sticky header */}
      <div className="relative">
        <div className="overflow-auto bg-white border border-[#E6E6E7] rounded-lg shadow-sm max-h-[calc(100vh-200px)]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F0F0F0] text-[#4B4D4F] font-semibold border-b border-[#E6E6E7] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Req. ID</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3 text-center">Required Qty</th>
                <th className="px-4 py-3 text-center">Available Qty</th>
                <th className="px-4 py-3 text-center">Issued Qty</th>
                <th className="px-4 py-3 text-center">Bal. Qty</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-500">
                    No requisitions available.
                  </td>
                </tr>
              ) : (
                requisitions.map((req) =>
                  req.items.map((item, index) => (
                    <tr key={`${req.id}-${index}`} className="border-b border-[#E6E6E7] hover:bg-gray-50 transition">
                      <td className="px-4 py-2 whitespace-nowrap">{req.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{req.department}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.itemname}</td>
                      <td className="px-4 py-2 text-center">{item.requiredQty}</td>
                      <td className="px-4 py-2 text-center">{item.availableQty}</td>
                      <td className="px-4 py-2 text-center">{item.issuedQty || 0}</td>
                      <td className="px-4 py-2 text-center">
                        {item.availableQty - (item.issuedQty || 0)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.remarks}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
                        <button className="text-green-600 hover:underline text-sm">Approve</button>
                        <button className="text-red-500 hover:underline text-sm">Reject</button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequisitionPage;