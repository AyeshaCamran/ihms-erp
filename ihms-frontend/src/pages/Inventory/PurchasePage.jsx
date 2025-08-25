// src/pages/Inventory/PurchasePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

const PurchasePage = () => {
  const navigate = useNavigate();
  
  // State management
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    total_approved_amount: 0
  });

  // Filter tabs
  const tabs = [
    { id: "All", label: "All Vouchers", count: stats.total },
    { id: "Pending", label: "Pending", count: stats.pending },
    { id: "Approved", label: "Approved", count: stats.approved },
    { id: "Rejected", label: "Rejected", count: stats.rejected }
  ];

  // Get current user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData && token) {
      // Parse user data - adjust based on your auth implementation
      try {
        // If user data is stored as JSON
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch {
        // If user data is stored as string (just name)
        setCurrentUser({ name: userData, role: "PO" }); // Default role for testing
      }
    }
  }, []);

  // Fetch vouchers and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch vouchers
      const vouchersResponse = await fetch("http://localhost:8001/inventory/vouchers", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!vouchersResponse.ok) {
        throw new Error(`Failed to fetch vouchers: ${vouchersResponse.status}`);
      }

      const vouchersData = await vouchersResponse.json();
      setVouchers(vouchersData);

      // Fetch stats
      const statsResponse = await fetch("http://localhost:8001/inventory/vouchers-stats", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      setStats(statsData);

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter vouchers based on search and status
  useEffect(() => {
    let filtered = vouchers;

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(voucher => voucher.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(voucher =>
        voucher.voucher_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (voucher.po_number && voucher.po_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (voucher.invoice_number && voucher.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVouchers(filtered);
  }, [vouchers, searchTerm, statusFilter]);

  // Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Handle voucher actions
  const handleView = (voucherId) => {
    navigate(`/inventory/purchase/voucher/${voucherId}`);
  };

  const handleEdit = (voucherId) => {
    navigate(`/inventory/purchase/voucher/edit/${voucherId}`);
  };

  const handleDelete = async (voucherId) => {
    if (!window.confirm("Are you sure you want to delete this voucher?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/vouchers/${voucherId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete voucher");
      }

      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("Failed to delete voucher: " + error.message);
    }
  };

  const handleApprove = async (voucherId, status, remarks = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/vouchers/${voucherId}/approve`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: status,
          approved_remarks: remarks
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update voucher status");
      }

      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error updating voucher:", error);
      alert("Failed to update voucher: " + error.message);
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Approved": "bg-green-100 text-green-800",
      "Rejected": "bg-red-100 text-red-800",
      "Paid": "bg-blue-100 text-blue-800"
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  // Check permissions
  const canCreateVoucher = currentUser?.role === "PO";
  const canApproveVoucher = currentUser?.role === "Inventory Admin";
  const canEditVoucher = (voucher) => {
    return currentUser?.name === voucher.created_by || 
           currentUser?.role === "Administrator" || 
           currentUser?.role === "Inventory Admin";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading vouchers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Management</h2>
        <p className="text-gray-600">Manage purchase vouchers and track payment status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <RefreshCw className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Approved Amount</p>
              <p className="text-2xl font-bold text-blue-600">₹{stats.total_approved_amount.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === tab.id
                    ? "bg-[#233955] text-white"
                    : "text-gray-600 hover:text-[#233955] bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center rounded-md bg-[#F0F0F0] px-4 py-2 text-sm text-gray-500 w-[280px]">
              <Search size={16} className="mr-2" />
              <input
                type="text"
                placeholder="Search vouchers..."
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

            {/* Add Voucher button - Only for PO */}
            {canCreateVoucher && (
              <button
                onClick={() => navigate("/inventory/purchase/voucher/add")}
                className="bg-[#233955] hover:bg-[#1a2a40] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Add Voucher
              </button>
            )}
          </div>
        </div>
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

      {/* Vouchers Table */}
      <div className="relative">
        <div className="overflow-auto bg-white border border-[#E6E6E7] rounded-lg shadow-sm max-h-[calc(100vh-250px)]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F0F0F0] text-[#4B4D4F] font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3">Voucher No.</th>
                <th className="px-3 py-3">Vendor Name</th>
                <th className="px-3 py-3">PO Number</th>
                <th className="px-3 py-3">Invoice Number</th>
                <th className="px-3 py-3">Bill Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Store Keeper</th>
                <th className="px-3 py-3">Created By</th>
                <th className="px-3 py-3">Created Date</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-3 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== "All" 
                      ? "No vouchers found matching your criteria" 
                      : "No vouchers created yet"}
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <span className="font-medium text-blue-600">{voucher.voucher_number}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium">{voucher.vendor_name}</p>
                        {voucher.vendor_gst && (
                          <p className="text-xs text-gray-500">GST: {voucher.vendor_gst}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">{voucher.po_number || "-"}</td>
                    <td className="px-3 py-3">{voucher.invoice_number || "-"}</td>
                    <td className="px-3 py-3">
                      <span className="font-medium">₹{voucher.bill_amount.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(voucher.status)}`}>
                        {voucher.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">{voucher.store_keeper || "-"}</td>
                    <td className="px-3 py-3">{voucher.created_by}</td>
                    <td className="px-3 py-3">
                      {new Date(voucher.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {/* View button */}
                        <button
                          onClick={() => handleView(voucher.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View voucher"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit button - Only for creator or admin */}
                        {canEditVoucher(voucher) && voucher.status === "Pending" && (
                          <button
                            onClick={() => handleEdit(voucher.id)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Edit voucher"
                          >
                            <Edit size={16} />
                          </button>
                        )}

                        {/* Delete button - Only for creator or admin and pending status */}
                        {canEditVoucher(voucher) && voucher.status === "Pending" && (
                          <button
                            onClick={() => handleDelete(voucher.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete voucher"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                        {/* Approve/Reject buttons - Only for Inventory Admin */}
                        {canApproveVoucher && voucher.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(voucher.id, "Approved")}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Approve voucher"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const remarks = prompt("Enter rejection reason (optional):");
                                if (remarks !== null) {
                                  handleApprove(voucher.id, "Rejected", remarks);
                                }
                              }}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Reject voucher"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredVouchers.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Showing {filteredVouchers.length} of {vouchers.length} vouchers
            {statusFilter !== "All" && ` (filtered by ${statusFilter})`}
            {searchTerm && ` (searching for "${searchTerm}")`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchasePage;