import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

const RequisitionPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeStatus, setActiveStatus] = useState("All");
  const navigate = useNavigate();

  const statusTabs = [
    { label: "All", count: 128 },
    { label: "Approved", count: 98 },
    { label: "Pending", count: 18 },
    { label: "Rejected", count: 12 },
  ];

  useEffect(() => {
    const fetchUserAndRequisitions = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const user = await res.json();
        setCurrentUser(user);

        const requisitionsRes = await fetch("http://localhost:8001/inventory/requisition", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await requisitionsRes.json();
        setRequisitions(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchUserAndRequisitions();
  }, []);

  const handleStatusChange = async (id, role, status) => {
    const remarks = prompt("Add remarks (optional):");
    const payload = {};

    if (role === "HOD") {
      payload.hod_status = status;
      payload.hod_remarks = remarks;
    } else if (role === "Dean") {
      payload.dean_status = status;
      payload.dean_remarks = remarks;
    } else if (role === "Inventory Admin") {
      payload.inventory_status = status;
      payload.inventory_remarks = remarks;
    }

    try {
      await fetch(`http://localhost:8001/inventory/requisition/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const updated = await fetch("http://localhost:8001/inventory/requisition", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json());

      setRequisitions(updated);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="w-full px-2 sm:px-2 lg:px-2 py-2">
      <div className="sticky top-0 z-20 bg-white pb-4 flex items-center justify-between flex-nowrap w-full mb-4 gap-3 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-3">
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

          <div className="flex items-center rounded-md bg-[#F0F0F0] px-4 py-2 text-sm text-gray-500 w-[240px]">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/inventory/requisition/request")}
          className="bg-[#233955] hover:bg-[#1a2a40] text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
        >
          + New Request
        </button>
      </div>

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
                <th className="px-4 py-3">HOD Status</th>
                <th className="px-4 py-3">Dean Status</th>
                <th className="px-4 py-3">Inventory Admin Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center py-6 text-gray-500">
                    No requisitions available.
                  </td>
                </tr>
              ) : (
                requisitions.flatMap((req) =>
                  req.items.map((item, index) => (
                    <tr key={`${req.id}-${index}`} className="border-b border-[#E6E6E7] hover:bg-gray-50 transition">
                      <td className="px-4 py-2 whitespace-nowrap">{req.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{req.department}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.itemname}</td>
                      <td className="px-4 py-2 text-center">{item.requiredQty}</td>
                      <td className="px-4 py-2 text-center">{item.availableQty}</td>
                      <td className="px-4 py-2 text-center">{item.issuedQty || 0}</td>
                      <td className="px-4 py-2 text-center">{item.availableQty - (item.issuedQty || 0)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.remarks}</td>
                      <td className={`px-4 py-2 whitespace-nowrap ${getStatusColor(req.hod_status)}`}>
                        {req.hod_status || "Pending"}
                      </td>
                      <td className={`px-4 py-2 whitespace-nowrap ${getStatusColor(req.dean_status)}`}>
                        {req.dean_status || "Pending"}
                      </td>
                      <td className={`px-4 py-2 whitespace-nowrap ${getStatusColor(req.inventory_status)}`}>
                        {req.inventory_status || "Pending"}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => navigate(`/inventory/requisition/view/${req.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          <Eye size={16} />
                        </button>

                        {currentUser?.role === "HOD" && req.hod_status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, "HOD", "Approved")}
                              className="text-green-600 hover:underline"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "HOD", "Rejected")}
                              className="text-red-600 hover:underline"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}

                        {currentUser?.role === "Dean" && req.dean_status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, "Dean", "Approved")}
                              className="text-green-600 hover:underline"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "Dean", "Rejected")}
                              className="text-red-600 hover:underline"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}

                        {currentUser?.role === "Inventory Admin" && req.inventory_status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, "Inventory Admin", "Approved")}
                              className="text-green-600 hover:underline"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "Inventory Admin", "Rejected")}
                              className="text-red-600 hover:underline"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
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
