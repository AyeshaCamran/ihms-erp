import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const navigate = useNavigate();

  const statusTabs = [
    { label: "All", count: 128 },
    { label: "Pending", count: 42 },
    { label: "In Progress", count: 38 },
    { label: "Resolved", count: 48 },
  ];

  useEffect(() => {
    fetch("http://localhost:8001/inventory/maintenance")
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full px-2 sm:px-2 lg:px-2 py-2">
      {/* Top Control Bar with sticky positioning and higher z-index */}
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

          {/* Search Field */}
          <div className="flex items-center rounded-md bg-[#F0F0F0] px-4 py-2 text-sm text-gray-500 w-[240px]">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Aligned Button */}
        <button
          onClick={() => navigate("/inventory/maintenance/complaint")}
          className="bg-[#233955] hover:bg-[#1a2a40] text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
        >
          + Maintenance / Complaint
        </button>
      </div>

      {/* Table Container with proper sticky header */}
      <div className="relative">
        <div className="overflow-auto bg-white border border-[#E6E6E7] rounded-lg shadow-sm max-h-[calc(100vh-200px)]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F0F0F0] text-[#4B4D4F] font-semibold border-b border-[#E6E6E7] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Complaint No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Emp. Code</th>
                <th className="px-4 py-3">Name of Complaint</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Nature</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">PDF</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="border-b border-[#E6E6E7] hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">{r.complaint_no}</td>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.emp_code}</td>
                    <td className="px-4 py-2">{r.complaint}</td>
                    <td className="px-4 py-2">{r.department}</td>
                    <td className="px-4 py-2">{r.nature_of_maintenance}</td>
                    <td className="px-4 py-2">{r.type_of_maintenance}</td>
                    <td className="px-4 py-2">{r.description}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => window.open(`/maintenance/print/${r.id}`, "_blank")}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;