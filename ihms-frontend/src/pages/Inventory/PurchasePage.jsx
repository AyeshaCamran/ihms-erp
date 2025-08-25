// Updated and Corrected src/pages/Inventory/PurchasePage.jsx
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
  
  // State management
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

  // Get current user for role-based access
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

  // Fetch all data with enhanced error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Fetch Purchase Vouchers with error handling
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

      // Fetch Material Vouchers with error handling
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

      // Fetch Approved Requisitions with error handling
      try {
        const requisitionsResponse = await fetch("http://localhost:8001/inventory/requisition?status=Approved", {
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
      } catch (requisitionError) {
        console.error("Requisitions fetch error:", requisitionError);
        setRequisitions([]);
      }

    } catch (error) {
      console.error("Error in fetchData:", error);
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
    const currentData = activeTab === "purchase" ? vouchers : materialVouchers;
    let filtered = currentData;

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        if (activeTab === "purchase") {
          return (
            item.voucher_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          return (
            item.voucher_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.req_form_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.received_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }

    setFilteredVouchers(filtered);
  }, [vouchers, materialVouchers, searchTerm, statusFilter, activeTab]);

  // Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Purchase Voucher Actions
  const handleView = (voucherId) => {
    navigate(`/inventory/purchase/voucher/${voucherId}`);
  };

  const handleEdit = (voucherId) => {
    navigate(`/inventory/purchase/voucher/edit/${voucherId}`);
  };

  const handleDelete = async (voucherId) => {
    if (!window.confirm("Are you sure you want to delete this voucher?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/vouchers/${voucherId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setVouchers(vouchers.filter(v => v.id !== voucherId));
      } else {
        throw new Error("Failed to delete voucher");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("Failed to delete voucher");
    }
  };

  // Material Voucher Actions
  const handleMaterialView = (materialVoucherId) => {
    navigate(`/inventory/purchase/material-voucher/${materialVoucherId}`);
  };

  const handleMaterialEdit = (materialVoucherId) => {
    navigate(`/inventory/purchase/material-voucher/edit/${materialVoucherId}`);
  };

  const handleMaterialDelete = async (materialVoucherId) => {
    if (!window.confirm("Are you sure you want to delete this material voucher?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/material-vouchers/${materialVoucherId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setMaterialVouchers(materialVouchers.filter(v => v.id !== materialVoucherId));
      } else {
        throw new Error("Failed to delete material voucher");
      }
    } catch (error) {
      console.error("Error deleting material voucher:", error);
      alert("Failed to delete material voucher");
    }
  };

  // Create Material Voucher from Requisition
  const handleCreateMaterialVoucher = (requisition) => {
    navigate("/inventory/purchase/material-voucher/new", {
      state: { requisition }
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase & Material Management</h2>
        <p className="text-gray-600">Manage purchase vouchers and material issuing vouchers</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
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

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
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

      {/* Content based on active tab */}
      <div className="bg-white rounded-lg shadow">
        {/* Purchase Vouchers Tab */}
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
                      <p className="text-sm mt-1">Click "Add Purchase Voucher" to create your first voucher</p>
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {voucher.voucher_number || `PV-${voucher.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          PO: {voucher.po_number || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{voucher.vendor_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Invoice: {voucher.invoice_number || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{voucher.bill_amount || '0'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          voucher.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          voucher.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          voucher.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {voucher.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(voucher.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(voucher.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(voucher.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
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

        {/* Material Vouchers Tab */}
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
                        {new Date(voucher.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMaterialView(voucher.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleMaterialEdit(voucher.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleMaterialDelete(voucher.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
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

        {/* Approved Requisitions Tab */}
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
                    Created By
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
                {requisitions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Plus size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No approved requisitions available</p>
                      <p className="text-sm mt-1">
                        Approved requisitions will appear here for material voucher creation
                      </p>
                    </td>
                  </tr>
                ) : (
                  requisitions.map((requisition) => (
                    <tr key={requisition.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          REQ-{requisition.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {requisition.justification?.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requisition.department}</div>
                        <div className="text-sm text-gray-500">{requisition.month}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requisition.created_by}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {requisition.overall_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(requisition.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleCreateMaterialVoucher(requisition)}
                          className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-xs"
                        >
                          <Plus size={12} />
                          Create Voucher
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
    </div>
  );
};

export default PurchasePage;