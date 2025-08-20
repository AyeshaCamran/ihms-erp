import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Clock } from "lucide-react";

const RequisitionPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // ✅ STEP 7: Calculate status counts from actual data
  const getStatusCounts = () => {
    const all = requisitions.length;
    const pending = requisitions.filter(req => req.overall_status === "Pending").length;
    const inProgress = requisitions.filter(req => 
      req.overall_status && 
      req.overall_status.includes("Approved") && 
      !req.overall_status.includes("Ready for Issue")
    ).length;
    const approved = requisitions.filter(req => 
      req.overall_status === "Approved - Ready for Issue"
    ).length;
    const rejected = requisitions.filter(req => 
      req.overall_status && req.overall_status.includes("Rejected")
    ).length;
    const issued = requisitions.filter(req => req.overall_status === "Issued").length;

    return { all, pending, inProgress, approved, rejected, issued };
  };

  const statusCounts = getStatusCounts();
  const statusTabs = [
    { label: "All", count: statusCounts.all },
    { label: "Pending", count: statusCounts.pending },
    { label: "In Progress", count: statusCounts.inProgress },
    { label: "Approved", count: statusCounts.approved },
    { label: "Rejected", count: statusCounts.rejected },
    { label: "Issued", count: statusCounts.issued },
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
        console.log("🔍 Overall status:", data[0].overall_status);
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

  // ✅ STEP 7: Handle approval/rejection with new API
  const handleStatusChange = async (id, action) => {
    const remarks = prompt(`${action === "Approved" ? "Approval" : "Rejection"} remarks (optional):`);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/requisition/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action,
          remarks: remarks || ""
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update status");
      }

      const result = await response.json();
      console.log("✅ Status updated successfully:", result);
      
      alert(`${action} successfully! ${result.message}`);
      
      // ✅ Refresh data after update
      await handleRefresh();
      
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert(`Failed to ${action.toLowerCase()}: ${err.message}`);
    }
  };

  // ✅ STEP 7: Get status color helper with new workflow
  const getStatusColor = (status) => {
    if (!status) return "text-gray-600";
    
    if (status.includes("Approved") || status === "Issued") {
      return "text-green-600";
    } else if (status.includes("Rejected")) {
      return "text-red-600";
    } else if (status === "Pending") {
      return "text-yellow-600";
    } else {
      return "text-blue-600";
    }
  };

  // ✅ STEP 7: Get status display text
  const getStatusDisplay = (status) => {
    if (!status) return "Unknown";
    return status;
  };

  // ✅ STEP 7: Check if user can approve this requisition
  const canUserApprove = (req) => {
    const userRole = currentUser?.role;
    
    switch (userRole) {
      case "HOD":
        return req.hod_status === "Pending";
      case "Dean":
        return req.hod_status === "Approved" && req.dean_status === "Pending";
      case "Competent Authority":
        return req.dean_status === "Approved" && req.ca_status === "Pending";
      case "PO":
        return req.ca_status === "Approved" && req.po_status === "Pending";
      case "Inventory Admin":
        return req.po_status === "Approved" && req.inventory_status === "Pending";
      default:
        return false;
    }
  };

  // ✅ STEP 7: Filter requisitions based on active status and search
  const filteredRequisitions = requisitions.filter(req => {
    // Status filter
    let statusMatch = true;
    if (activeStatus !== "All") {
      switch (activeStatus) {
        case "Pending":
          statusMatch = req.overall_status === "Pending";
          break;
        case "In Progress":
          statusMatch = req.overall_status && 
                       req.overall_status.includes("Approved") && 
                       !req.overall_status.includes("Ready for Issue");
          break;
        case "Approved":
          statusMatch = req.overall_status === "Approved - Ready for Issue";
          break;
        case "Rejected":
          statusMatch = req.overall_status && req.overall_status.includes("Rejected");
          break;
        case "Issued":
          statusMatch = req.overall_status === "Issued";
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

  // ✅ Check if user can create new requisitions
  const canCreateRequisition = currentUser?.role === "Incharge";

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

        {/* Add button - Only for Incharge */}
        {canCreateRequisition && (
          <button
            onClick={() => navigate("/inventory/requisition/request")}
            className="bg-[#233955] hover:bg-[#1a2a40] text-white px-4 py-2 rounded-md text-sm"
          >
            + New Requisition
          </button>
        )}
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

      {/* Current user info */}
      {currentUser && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Logged in as:</strong> {currentUser.name} ({currentUser.role})
            {currentUser.department && ` - ${currentUser.department}`}
          </p>
        </div>
      )}

      {/* STEP 7: Updated Table with complete workflow columns */}
      <div className="relative">
        <div className="overflow-auto bg-white border border-[#E6E6E7] rounded-lg shadow-sm max-h-[calc(100vh-250px)]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F0F0F0] text-[#4B4D4F] font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3">Req. ID</th>
                <th className="px-3 py-3">Department</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Created By</th>
                <th className="px-3 py-3">Overall Status</th>
                <th className="px-3 py-3">HOD</th>
                <th className="px-3 py-3">Dean</th>
                <th className="px-3 py-3">CA</th>
                <th className="px-3 py-3">PO</th>
                <th className="px-3 py-3">Inventory</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.length > 0 ? (
                filteredRequisitions.map((req) => (
                  <tr key={req.id} className="border-b border-[#E6E6E7] hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">REQ-{req.id}</td>
                    <td className="px-3 py-2">{req.department}</td>
                    <td className="px-3 py-2">{new Date(req.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{req.created_by || "Unknown"}</td>
                    <td className={`px-3 py-2 font-medium ${getStatusColor(req.overall_status)}`}>
                      <div className="flex items-center space-x-1">
                        {req.overall_status === "Pending" && <Clock size={14} />}
                        {req.overall_status && req.overall_status.includes("Approved") && <CheckCircle size={14} />}
                        {req.overall_status && req.overall_status.includes("Rejected") && <XCircle size={14} />}
                        <span>{getStatusDisplay(req.overall_status)}</span>
                      </div>
                    </td>
                    
                    {/* ✅ STEP 7: Individual approval status columns */}
                    <td className={`px-3 py-2 text-xs ${getStatusColor(req.hod_status)}`}>
                      {req.hod_status || "Pending"}
                    </td>
                    <td className={`px-3 py-2 text-xs ${getStatusColor(req.dean_status)}`}>
                      {req.dean_status || "Pending"}
                    </td>
                    <td className={`px-3 py-2 text-xs ${getStatusColor(req.ca_status)}`}>
                      {req.ca_status || "Pending"}
                    </td>
                    <td className={`px-3 py-2 text-xs ${getStatusColor(req.po_status)}`}>
                      {req.po_status || "Pending"}
                    </td>
                    <td className={`px-3 py-2 text-xs ${getStatusColor(req.inventory_status)}`}>
                      {req.inventory_status || "Pending"}
                    </td>
                    
                    {/* Items count */}
                    <td className="px-3 py-2 text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {req.items?.length || 0} items
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        {/* View button */}
                        <button
                          onClick={() => navigate(`/inventory/requisition/view/${req.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* ✅ STEP 7: Approve/Reject buttons based on user permissions */}
                        {canUserApprove(req) && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(req.id, "Approved")} 
                              className="text-green-600 hover:text-green-800"
                              title={`Approve as ${currentUser.role}`}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(req.id, "Rejected")} 
                              className="text-red-600 hover:text-red-800"
                              title={`Reject as ${currentUser.role}`}
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        
                        {/* Show waiting message if not user's turn */}
                        {!canUserApprove(req) && req.overall_status !== "Issued" && req.overall_status !== "Approved - Ready for Issue" && (
                          <span className="text-xs text-gray-500">
                            {req.overall_status === "Pending" ? "Waiting for HOD" :
                             req.hod_status === "Approved" && req.dean_status === "Pending" ? "Waiting for Dean" :
                             req.dean_status === "Approved" && req.ca_status === "Pending" ? "Waiting for CA" :
                             req.ca_status === "Approved" && req.po_status === "Pending" ? "Waiting for PO" :
                             req.po_status === "Approved" && req.inventory_status === "Pending" ? "Waiting for Inventory" :
                             "Processing"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-8 text-gray-500">
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
                        {canCreateRequisition && (
                          <button 
                            onClick={() => navigate("/inventory/requisition/request")}
                            className="mt-2 text-blue-600 hover:underline"
                          >
                            Create your first requisition
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ STEP 7: Enhanced summary info with workflow status */}
      {filteredRequisitions.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Total:</strong> {filteredRequisitions.length} requisition(s)</p>
            {searchTerm && <p><strong>Search:</strong> "{searchTerm}"</p>}
            {activeStatus !== "All" && <p><strong>Status:</strong> {activeStatus}</p>}
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <p><strong>Your Role:</strong> {currentUser?.role}</p>
            <p><strong>Department:</strong> {currentUser?.department || "All"}</p>
            <p><strong>Can Create:</strong> {canCreateRequisition ? "Yes" : "No"}</p>
          </div>
          
          <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
            <p><strong>Pending Your Approval:</strong> {
              filteredRequisitions.filter(req => canUserApprove(req)).length
            }</p>
            <p><strong>Workflow:</strong> Incharge → HOD → Dean → CA → PO → Inventory</p>
          </div>
        </div>
      )}

      {/* ✅ STEP 7: Help text for workflow */}
      <div className="mt-6 bg-gray-50 border-l-4 border-blue-500 p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Requisition Workflow:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Step 1:</strong> Department Incharge creates requisition request</p>
          <p><strong>Step 2:</strong> Head of Department (HOD) reviews and approves/rejects</p>
          <p><strong>Step 3:</strong> Dean reviews and approves/rejects (if HOD approved)</p>
          <p><strong>Step 4:</strong> Competent Authority reviews and approves/rejects (if Dean approved)</p>
          <p><strong>Step 5:</strong> Purchase Officer (PO) reviews and approves/rejects (if CA approved)</p>
          <p><strong>Step 6:</strong> Inventory Admin processes and issues materials (if PO approved)</p>
        </div>
        
        {currentUser && (
          <div className="mt-3 p-2 bg-white rounded border">
            <p className="text-sm">
              <strong>Your Actions:</strong> 
              {currentUser.role === "Incharge" && " You can create new requisitions for your department."}
              {currentUser.role === "HOD" && " You can approve/reject requisitions from your department."}
              {currentUser.role === "Dean" && " You can approve/reject requisitions that HOD has approved."}
              {currentUser.role === "Competent Authority" && " You can approve/reject requisitions that Dean has approved."}
              {currentUser.role === "PO" && " You can approve/reject requisitions that CA has approved."}
              {currentUser.role === "Inventory Admin" && " You can process and issue materials for approved requisitions."}
              {!["Incharge", "HOD", "Dean", "Competent Authority", "PO", "Inventory Admin"].includes(currentUser.role) && " You can view requisitions but cannot make approvals."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisitionPage;