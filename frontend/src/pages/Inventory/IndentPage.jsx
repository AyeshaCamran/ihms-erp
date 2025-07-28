import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit } from "lucide-react";

const IndentPage = () => {
  const navigate = useNavigate();

  const statusTabs = [
    { label: "All", count: 2 },
    { label: "Pending", count: 1 },
    { label: "Verified", count: 1 },
    { label: "Approved", count: 1 },
    { label: "Issued", count: 1 },
    { label: "Received", count: 1 }
  ];
  const [activeTab, setActiveTab] = React.useState("All");

  const indents = [
    {
      id: 1,
      department: "Emergency",
      date: "2025-07-17",
      inchargeStatus: "Verified",
      hodStatus: "Pending",
      dmsStatus: "Pending",
      issuedBy: "",
      receivedBy: "",
      overallStatus: "Pending"
    },
    {
      id: 2,
      department: "Surgery",
      date: "2025-07-15",
      inchargeStatus: "Verified",
      hodStatus: "Approved",
      dmsStatus: "Approved",
      issuedBy: "Pharmacist",
      receivedBy: "Store Incharge",
      overallStatus: "Received"
    }
  ];

  const filteredIndents = activeTab === "All"
    ? indents
    : indents.filter(indent => indent.overallStatus === activeTab);

  const renderStatusBadge = (status) => {
    let color = "gray";
    if (status === "Verified" || status === "Approved") color = "green";
    else if (status === "Pending") color = "yellow";
    else if (status === "Issued" || status === "Received") color = "blue";

    return (
      <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ✅ Dynamic Page Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Indent Requests</h2>

      {/* ✅ Status Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`text-sm px-4 py-1.5 rounded-full border transition ${
              activeTab === tab.label
                ? "bg-blue-900 text-white"
                : "text-gray-700 bg-gray-100"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* ✅ Toolbar Controls */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <button className="p-2 bg-white rounded border border-gray-300 hover:shadow-sm">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"
            />
          </svg>
        </button>
        <select className="text-sm bg-white border border-gray-300 rounded px-3 py-1.5">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
        <button
          className="bg-blue-900 text-white text-sm px-4 py-2 rounded flex items-center gap-1"
          onClick={() => navigate("/inventory/indent/indent-form")}
        >
          Request Indent
        </button>
      </div>

      {/* ✅ Indents Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Incharge</th>
              <th className="p-2 border">HOD</th>
              <th className="p-2 border">DMS</th>
              <th className="p-2 border">Issued By</th>
              <th className="p-2 border">Received By</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndents.map((indent, idx) => (
              <tr key={indent.id} className="text-center">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{indent.department}</td>
                <td className="p-2 border">{indent.date}</td>
                <td className="p-2 border">{renderStatusBadge(indent.inchargeStatus)}</td>
                <td className="p-2 border">{renderStatusBadge(indent.hodStatus)}</td>
                <td className="p-2 border">{renderStatusBadge(indent.dmsStatus)}</td>
                <td className="p-2 border">{indent.issuedBy || "-"}</td>
                <td className="p-2 border">{indent.receivedBy || "-"}</td>
                <td className="p-2 border">{renderStatusBadge(indent.overallStatus)}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600 cursor-pointer" />
                  <Edit className="w-4 h-4 text-gray-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndentPage;
