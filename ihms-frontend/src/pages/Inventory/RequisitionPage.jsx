import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const RequisitionPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // ✅ Calculate status counts from actual data
  const getStatusCounts = () => {
    const all = requisitions.length;
    const approved = requisitions.filter(req => 
      req.hod_status === "Approved" || 
      req.dean_status === "Approved" || 
      req.inventory_status === "Approved"
    ).length;
    const pending = requisitions.filter(req => 
      req.hod_status === "Pending" || 
      req.dean_status === "Pending" || 
      req.inventory_status === "Pending"
    ).length;
    const rejected = requisitions.filter(req => 
      req.hod_status === "Rejected" || 
      req.dean_status === "Rejected" || 
      req.inventory_status === "Rejected"
    ).length;

    return { all, approved, pending, rejected };
  };

  const statusCounts = getStatusCounts();
  const statusTabs = [
    { label: "All", count: statusCounts.all },
    { label: "Approved", count: statusCounts.approved },
    { label: "Pending", count: statusCounts.pending },
    { label: "Rejected", count: statusCounts.rejected },
  ];

  // ✅ Fetch current user first
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return null;
      }

      const res = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const user = await res.json();
      console.log("✅ Current user:", user);
      return user;
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setError("Failed to authenticate user");
      navigate("/login");
      return null;
    }
  };

  // ✅ Fetch requisitions with proper error handling
  const fetchRequisitions = async (user) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("🔍 Fetching requisitions for user:", user);

      // ✅ Build query parameters
      const params = new URLSearchParams();
      if (user?.role) params.append('role', user.role);
      if (user?.department) params.append('department', user.department);

      const url = `http://localhost:8001/inventory/requisition?${params.toString()}`;
      console.log("📡 Request URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(`Failed to fetch requisitions: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Requisitions fetched:", data.length, "items");
      
      // ✅ Debug first requisition
      if (data.length > 0) {
        console.log("🔍 First requisition:", data[0]);
        console.log("🔍 First requisition items:", data[0].items?.length || 0);
      }

      setRequisitions(data);
      
    } catch (error) {
      console.error("❌ Error fetching requisitions:", error);
      setError(`Failed to fetch requisitions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      const user = await fetchCurrentUser();
      if (user) {
        setCurrentUser(user);
        await fetchRequisitions(user);
      }
    };

    initializeData();
  }, [navigate]);

  // ✅ Refresh data function
  const handleRefresh = async () => {
    if (currentUser) {
      await fetchRequisitions(currentUser);
    }
  };

  // ✅ Handle status updates
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
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/requisition/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      console.log("✅ Status updated successfully");
      
      // ✅ Refresh data after update
      await handleRefresh();
      
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  // ✅ Get status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      case "Pending":
      default:
        return "text-yellow-600";
    }
  };

  // ✅ Filter requisitions based on active status and search
  const filteredRequisitions = requisitions.filter(req => {
    // Status filter
    let statusMatch = true;
    if (activeStatus !== "All") {
      switch (activeStatus) {
        case "Approved":
          statusMatch = req.hod_status === "Approved" || 
                       req.dean_status === "Approved" || 
                       req.inventory_status === "Approved";
          break;
        case "Pending":
          statusMatch = req.hod_status === "Pending" || 
                       req.dean_status === "Pending" || 
                       req.inventory_status === "Pending";
          break;
        case "Rejected":
          statusMatch = req.hod_status === "Rejected" || 
                       req.dean_status === "Rejected" || 
                       req.inventory_status === "Rejected";
          break;
      }
    }

    // Search filter
    let searchMatch = true;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      searchMatch = req.id.toString().includes(search) ||
                   req.department.toLowerCase().includes(search) ||
                   req.items?.some(item => 
                     item.itemname?.toLowerCase().includes(search) ||
                     item.type?.toLowerCase().includes(search)
                   );
    }

    return statusMatch && searchMatch;
  });

  // ✅ Show action buttons based on user role and status
  const canApprove = (req, userRole) => {
    switch (userRole) {
      case "HOD":
        return req.hod_status === "Pending";
      case "Dean":
        return req.dean_status === "Pending";
      case "Inventory Admin":
        return req.inventory_status === "Pending";
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin" size={20} />
          <span>Loading requisitions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-2 lg:px-2 py-2">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white pb-4 flex items-center justify-between w-full mb-4 gap-3">
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

          {/* Search */}
          <div className="flex items-center rounded-md bg-[#F0F0F0] px-4 py-2 text-sm text-gray-500 w-[240px]">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Search requisitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full"
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Add button */}
        <button
          onClick={() => navigate("/inventory/requisition/request")}
          className="bg-[#233955] hover:bg-[#1a2a40] text-white px-4 py-2 rounded-md text-sm"
        >
          + New Request
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      <div className="relative">
        <div className="overflow-auto bg-white border border-[#E6E6E7] rounded-lg shadow-sm max-h-[calc(100vh-200px)]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F0F0F0] text-[#4B4D4F] font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Req. ID</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3 text-center">Required Qty</th>
                <th className="px-4 py-3 text-center">Available Qty</th>
                <th className="px-4 py-3 text-center">Issued Qty</th>
                <th className="px-4 py-3 text-center">Balance Qty</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">HOD Status</th>
                <th className="px-4 py-3">Dean Status</th>
                <th className="px-4 py-3">Inventory Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.length > 0 ? (
                filteredRequisitions.flatMap((req) =>
                  req.items && req.items.length > 0 ? req.items.map((item, index) => (
                    <tr key={`${req.id}-${index}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">REQ-{req.id}</td>
                      <td className="px-4 py-2">{req.department}</td>
                      <td className="px-4 py-2">{new Date(req.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{item.type || "-"}</td>
                      <td className="px-4 py-2">{item.itemname || "-"}</td>
                      <td className="px-4 py-2 text-center">{item.requiredQty || item.required_qty || 0}</td>
                      <td className="px-4 py-2 text-center">{item.availableQty || item.available_qty || 0}</td>
                      <td className="px-4 py-2 text-center">{item.issuedQty || item.issued_qty || 0}</td>
                      <td className="px-4 py-2 text-center">
                        {(item.balQty || item.bal_qty || 0)}
                      </td>
                      <td className="px-4 py-2">{item.remarks || "-"}</td>
                      <td className={`px-4 py-2 font-medium ${getStatusColor(req.hod_status)}`}>
                        {req.hod_status || "Pending"}
                      </td>
                      <td className={`px-4 py-2 font-medium ${getStatusColor(req.dean_status)}`}>
                        {req.dean_status || "Pending"}
                      </td>
                      <td className={`px-4 py-2 font-medium ${getStatusColor(req.inventory_status)}`}>
                        {req.inventory_status || "Pending"}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          {/* View button */}
                          <button
                            onClick={() => navigate(`/inventory/requisition/view/${req.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Approve/Reject buttons based on user role */}
                          {canApprove(req, currentUser?.role) && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(req.id, currentUser.role, "Approved")} 
                                className="text-green-600 hover:text-green-800"
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(req.id, currentUser.role, "Rejected")} 
                                className="text-red-600 hover:text-red-800"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : [(
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">REQ-{req.id}</td>
                      <td className="px-4 py-2">{req.department}</td>
                      <td className="px-4 py-2">{new Date(req.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-center text-gray-500" colSpan="6">No items found</td>
                      <td className={`px-4 py-2 font-medium ${getStatusColor(req.hod_status)}`}>
                        {req.hod_status || "Pending"}
                      </td>
                      <td className={`px-4 py-2 font-medium ${getStatusColor(req.dean_status)}`}>
                        {req.dean_status || "Pending"}
                      </td>
                      <td className={`px-4 py-2 font-medium ${getStatusColor(req.inventory_status)}`}>
                        {req.inventory_status || "Pending"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => navigate(`/inventory/requisition/view/${req.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  )]
                )
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-8 text-gray-500">
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="animate-spin" size={16} />
                        <span>Loading...</span>
                      </div>
                    ) : searchTerm ? (
                      <div>
                        <p>No requisitions found matching "{searchTerm}"</p>
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="mt-2 text-blue-600 hover:underline"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p>No requisitions available.</p>
                        <button 
                          onClick={() => navigate("/inventory/requisition/request")}
                          className="mt-2 text-blue-600 hover:underline"
                        >
                          Create your first requisition
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary info */}
      {filteredRequisitions.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequisitions.length} requisition(s)
          {searchTerm && ` matching "${searchTerm}"`}
          {activeStatus !== "All" && ` with status "${activeStatus}"`}
        </div>
      )}
    </div>
  );
};

export default RequisitionPage;