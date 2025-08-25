// ✅ Updated and Complete src/pages/Inventory/PurchasePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Receipt 
} from "lucide-react";

const PurchasePage = () => {
  const navigate = useNavigate();
  
  // ✅ State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [materialVouchers, setMaterialVouchers] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("purchase");
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Get current user for role-based access
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch {
        setCurrentUser({ role: "PO" }); // Default fallback
      }
    }
  }, []);

  // ✅ Fetch all data with enhanced error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // ✅ Fetch Purchase Vouchers with error handling
      try {
        const vouchersResponse = await fetch("http://localhost:8001/inventory/vouchers", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (vouchersResponse.ok) {
          const vouchersData = await vouchersResponse.json();
          setVouchers(Array.isArray(vouchersData) ? vouchersData : []);
        } else {
          console.warn("Failed to fetch purchase vouchers:", vouchersResponse.status);
          setVouchers([]);
        }
      } catch (voucherError) {
        console.error("Purchase vouchers fetch error:", voucherError);
        setVouchers([]);
      }

      // ✅ Fetch Material Vouchers with error handling
      try {
        const materialVouchersResponse = await fetch("http://localhost:8001/inventory/material-vouchers", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (materialVouchersResponse.ok) {
          const materialVouchersData = await materialVouchersResponse.json();
          setMaterialVouchers(Array.isArray(materialVouchersData) ? materialVouchersData : []);
        } else {
          console.warn("Failed to fetch material vouchers:", materialVouchersResponse.status);
          setMaterialVouchers([]);
        }
      } catch (materialError) {
        console.error("Material vouchers fetch error:", materialError);
        setMaterialVouchers([]);
      }

      // ✅ Fetch Approved Requisitions with error handling
      try {
        const requisitionsResponse = await fetch("http://localhost:8001/inventory/requisitions?status=approved", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (requisitionsResponse.ok) {
          const requisitionsData = await requisitionsResponse.json();
          setRequisitions(Array.isArray(requisitionsData) ? requisitionsData : []);
        } else {
          console.warn("Failed to fetch requisitions:", requisitionsResponse.status);
          setRequisitions([]);
        }
      } catch (reqError) {
        console.error("Requisitions fetch error:", reqError);
        setRequisitions([]);
      }

    } catch (error) {
      console.error("Error fetching purchase data:", error);
      setError(error.message || "Failed to load purchase data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Filter data based on search and status
  useEffect(() => {
    let data = [];
    
    if (activeTab === "purchase") {
      data = vouchers;
    } else if (activeTab === "material") {
      data = materialVouchers;
    } else if (activeTab === "requisitions") {
      data = requisitions;
    }

    // Apply search filter
    let filtered = data.filter(item => {
      const searchText = searchTerm.toLowerCase();
      if (activeTab === "purchase") {
        return (
          item.po_number?.toLowerCase().includes(searchText) ||
          item.vendor_name?.toLowerCase().includes(searchText) ||
          item.bill_no?.toLowerCase().includes(searchText)
        );
      } else if (activeTab === "material") {
        return (
          item.voucher_no?.toLowerCase().includes(searchText) ||
          item.req_form_no?.toLowerCase().includes(searchText) ||
          item.authorised_by?.toLowerCase().includes(searchText)
        );
      } else if (activeTab === "requisitions") {
        return (
          item.req_no?.toLowerCase().includes(searchText) ||
          item.department?.toLowerCase().includes(searchText) ||
          item.created_by?.toLowerCase().includes(searchText)
        );
      }
      return false;
    });

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredVouchers(filtered);
  }, [searchTerm, statusFilter, vouchers, materialVouchers, requisitions, activeTab]);

  // ✅ Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // ✅ Handle delete (with confirmation)
  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const endpoint = type === "material" ? "material-vouchers" : "vouchers";
      
      const response = await fetch(`http://localhost:8001/inventory/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.ok) {
        fetchData(); // Reload data
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  // ✅ Handle create material voucher from requisition
  const handleCreateMaterialVoucher = (requisition) => {
    navigate("/inventory/purchase/material-voucher/new", {
      state: { requisition }
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading purchase data: {error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Purchase Management</h1>
        <p className="text-gray-600 mt-2">Manage purchase vouchers, material vouchers, and approved requisitions</p>
      </div>

      {/* ✅ Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Purchase Vouchers</p>
              <p className="text-2xl font-semibold text-gray-900">{vouchers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Material Vouchers</p>
              <p className="text-2xl font-semibold text-gray-900">{materialVouchers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Plus className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Requisitions</p>
              <p className="text-2xl font-semibold text-gray-900">{requisitions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">₹</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchase Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{vouchers.reduce((sum, v) => sum + parseFloat(v.bill_amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Navigation Tabs */}
      <div className="bg-white rounded-t-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("purchase")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "purchase"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                Purchase Vouchers ({vouchers.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("material")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "material"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              disabled={currentUser?.role !== "PO"}
              title={currentUser?.role !== "PO" ? "Only Purchase Office can access Material Vouchers" : ""}
            >
              <div className={`flex items-center gap-2 ${currentUser?.role !== "PO" ? "opacity-50" : ""}`}>
                <Receipt size={16} />
                Material Vouchers ({materialVouchers.length})
                {currentUser?.role !== "PO" && <span className="text-xs">(Purchase Office Only)</span>}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("requisitions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "requisitions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              disabled={currentUser?.role !== "PO"}
              title={currentUser?.role !== "PO" ? "Only Purchase Office can create Material Vouchers from Requisitions" : ""}
            >
              <div className={`flex items-center gap-2 ${currentUser?.role !== "PO" ? "opacity-50" : ""}`}>
                <Plus size={16} />
                Approved Requisitions ({requisitions.length})
                {currentUser?.role !== "PO" && <span className="text-xs">(Purchase Office Only)</span>}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* ✅ Controls */}
      <div className="bg-white rounded-b-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={
                  activeTab === "purchase" 
                    ? "Search vouchers, vendors, PO..." 
                    : activeTab === "material"
                    ? "Search material vouchers, requisitions..."
                    : "Search requisitions..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            {(activeTab === "purchase" || activeTab === "material") && (
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Issued">Issued</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {activeTab === "purchase" && (
              <button
                onClick={() => navigate("/inventory/purchase/voucher/new")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Purchase Voucher
              </button>
            )}

            {activeTab === "material" && currentUser?.role === "PO" && (
              <button
                onClick={() => navigate("/inventory/purchase/material-voucher/new")}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Plus size={16} />
                Create Material Voucher
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Content based on active tab */}
      <div className="bg-white rounded-lg shadow">
        
        {/* ✅ Purchase Vouchers Tab */}
        {activeTab === "purchase" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voucher Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No purchase vouchers found</p>
                      <p className="text-sm mt-1">Create your first purchase voucher</p>
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {voucher.po_number || `PV-${voucher.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Bill: {voucher.bill_no || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{voucher.vendor_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          GST: {voucher.vendor_gst || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{parseFloat(voucher.bill_amount || 0).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Tax: ₹{parseFloat(voucher.tax_amount || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          voucher.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          voucher.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          voucher.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {voucher.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voucher.date ? new Date(voucher.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/inventory/purchase/voucher/${voucher.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/inventory/purchase/voucher/edit/${voucher.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher.id, "purchase")}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Material Vouchers Tab */}
        {activeTab === "material" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voucher Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Receipt size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No material vouchers found</p>
                      <p className="text-sm mt-1">Create material vouchers from approved requisitions</p>
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {voucher.voucher_no || `MV-${voucher.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Authorized: {voucher.authorised_by || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{voucher.req_form_no || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          {voucher.req_date ? new Date(voucher.req_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{voucher.received_by_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          Material: {voucher.material_status || 'Complete'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          voucher.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          voucher.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {voucher.status || 'Issued'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voucher.date ? new Date(voucher.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/inventory/purchase/material-voucher/${voucher.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/inventory/purchase/material-voucher/edit/${voucher.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher.id, "material")}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Approved Requisitions Tab */}
        {activeTab === "requisitions" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisition Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Plus size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No approved requisitions found</p>
                      <p className="text-sm mt-1">Approved requisitions will appear here for material voucher creation</p>
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((requisition) => (
                    <tr key={requisition.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {requisition.req_no || `REQ-${requisition.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          By: {requisition.created_by || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requisition.department || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          {requisition.purpose ? `Purpose: ${requisition.purpose.substring(0, 30)}...` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requisition.items?.length || 0} items</div>
                        <div className="text-sm text-gray-500">
                          Total Qty: {requisition.items?.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0) || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          requisition.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          requisition.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          requisition.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {requisition.priority || 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {requisition.date ? new Date(requisition.date).toLocaleDateString() : 
                         requisition.created_at ? new Date(requisition.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/inventory/requisition/view/${requisition.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Requisition"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleCreateMaterialVoucher(requisition)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            title="Create Material Voucher"
                          >
                            Create Voucher
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;