import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/iul green logo.jpg";

const RequisitionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [requisition, setRequisition] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Requisition-${requisition?.id || 'Unknown'}`,
  });

  // ✅ Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // ✅ Fetch requisition details
  useEffect(() => {
    const fetchRequisition = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch(`http://localhost:8001/inventory/requisition/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requisition");
        }

        const data = await response.json();
        setRequisition(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequisition();
    }
  }, [id]);

  // ✅ Status icon helper
  const getStatusIcon = (status) => {
    if (!status) return <Clock className="text-gray-500" size={16} />;
    
    if (status === "Approved") return <CheckCircle className="text-green-500" size={16} />;
    if (status === "Rejected") return <XCircle className="text-red-500" size={16} />;
    if (status === "Pending") return <Clock className="text-yellow-500" size={16} />;
    
    return <AlertCircle className="text-blue-500" size={16} />;
  };

  // ✅ Status color helper
  const getStatusColor = (status) => {
    if (!status) return "text-gray-600";
    
    if (status === "Approved" || status === "Issued") return "text-green-600";
    if (status === "Rejected") return "text-red-600";
    if (status === "Pending") return "text-yellow-600";
    
    return "text-blue-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading requisition details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate("/inventory/requisition")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Requisitions
          </button>
        </div>
      </div>
    );
  }

  if (!requisition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Requisition Not Found</h2>
          <p className="text-gray-600 mb-4">The requested requisition could not be found.</p>
          <button 
            onClick={() => navigate("/inventory/requisition")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Requisitions
          </button>
        </div>
      </div>
    );
  }

  // ✅ Parse material types and requirement types
  const materialTypes = requisition.material_types ? requisition.material_types.split(',') : [];
  const requirementTypes = requisition.requirement_types ? requisition.requirement_types.split(',') : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header with actions */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/inventory/requisition")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Requisitions</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Requisition REQ-{requisition.id}
                </h1>
                <p className="text-sm text-gray-500">
                  Created by {requisition.created_by} • {new Date(requisition.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              
              <div className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(requisition.overall_status)} bg-gray-100`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(requisition.overall_status)}
                  <span>{requisition.overall_status || "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ✅ Left column - Requisition details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              
              {/* ✅ Printable content */}
              <div ref={printRef} className="p-6">
                
                {/* ✅ Header for print */}
                <div className="flex justify-between items-center mb-6 border-b pb-4 print:border-b print:pb-4">
                  <img src={logo} alt="Integral Logo" className="h-16" />
                  <div className="text-center flex-grow">
                    <h2 className="text-xl font-bold">Requisition Form</h2>
                    <p className="text-sm text-gray-600">(For Procurement of Materials)</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold">Integral University</p>
                    <p>Kursi Road, Lucknow-226026</p>
                    <p className="font-semibold mt-2">REQ-{requisition.id}</p>
                  </div>
                </div>

                {/* ✅ Basic information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{requisition.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(requisition.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Month</label>
                    <p className="mt-1 text-sm text-gray-900">{requisition.month}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created By</label>
                    <p className="mt-1 text-sm text-gray-900">{requisition.created_by}</p>
                  </div>
                </div>

                {/* ✅ Material types and requirements */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material Types</label>
                    <div className="space-y-1">
                      {materialTypes.map((type, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-900">{type.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material Requirements</label>
                    <div className="space-y-1">
                      {requirementTypes.map((type, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-900">{type.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ✅ Items table */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Requested Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required Qty</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Available Qty</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issued Qty</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance Qty</th>
                          <th className="border px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requisition.items?.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border px-3 py-2 text-sm">{index + 1}</td>
                            <td className="border px-3 py-2 text-sm">{item.type || "-"}</td>
                            <td className="border px-3 py-2 text-sm font-medium">{item.itemname}</td>
                            <td className="border px-3 py-2 text-sm">{item.required_qty}</td>
                            <td className="border px-3 py-2 text-sm">{item.available_qty}</td>
                            <td className="border px-3 py-2 text-sm">{item.issued_qty || 0}</td>
                            <td className="border px-3 py-2 text-sm">{item.bal_qty}</td>
                            <td className="border px-3 py-2 text-sm">{item.remarks || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ✅ Justification */}
                {requisition.justification && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Justification</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                      {requisition.justification}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ✅ Right column - Approval workflow */}
          <div className="space-y-6">
            
            {/* ✅ Approval Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Workflow</h3>
              
              <div className="space-y-4">
                {/* Step 1: Incharge */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Incharge</p>
                    <p className="text-xs text-gray-500">Created by {requisition.created_by}</p>
                    <p className="text-xs text-gray-400">{new Date(requisition.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Step 2: HOD */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(requisition.hod_status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">HOD Approval</p>
                    <p className={`text-xs ${getStatusColor(requisition.hod_status)}`}>
                      {requisition.hod_status || "Pending"}
                    </p>
                    {requisition.hod_approved_at && (
                      <p className="text-xs text-gray-400">{new Date(requisition.hod_approved_at).toLocaleString()}</p>
                    )}
                    {requisition.hod_remarks && (
                      <p className="text-xs text-gray-600 mt-1">"{requisition.hod_remarks}"</p>
                    )}
                  </div>
                </div>

                {/* Step 3: Dean */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(requisition.dean_status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Dean Approval</p>
                    <p className={`text-xs ${getStatusColor(requisition.dean_status)}`}>
                      {requisition.dean_status || "Pending"}
                    </p>
                    {requisition.dean_approved_at && (
                      <p className="text-xs text-gray-400">{new Date(requisition.dean_approved_at).toLocaleString()}</p>
                    )}
                    {requisition.dean_remarks && (
                      <p className="text-xs text-gray-600 mt-1">"{requisition.dean_remarks}"</p>
                    )}
                  </div>
                </div>

                {/* Step 4: CA */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(requisition.ca_status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Competent Authority</p>
                    <p className={`text-xs ${getStatusColor(requisition.ca_status)}`}>
                      {requisition.ca_status || "Pending"}
                    </p>
                    {requisition.ca_approved_at && (
                      <p className="text-xs text-gray-400">{new Date(requisition.ca_approved_at).toLocaleString()}</p>
                    )}
                    {requisition.ca_remarks && (
                      <p className="text-xs text-gray-600 mt-1">"{requisition.ca_remarks}"</p>
                    )}
                  </div>
                </div>

                {/* Step 5: PO */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(requisition.po_status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Purchase Officer</p>
                    <p className={`text-xs ${getStatusColor(requisition.po_status)}`}>
                      {requisition.po_status || "Pending"}
                    </p>
                    {requisition.po_approved_at && (
                      <p className="text-xs text-gray-400">{new Date(requisition.po_approved_at).toLocaleString()}</p>
                    )}
                    {requisition.po_remarks && (
                      <p className="text-xs text-gray-600 mt-1">"{requisition.po_remarks}"</p>
                    )}
                  </div>
                </div>

                {/* Step 6: Inventory */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(requisition.inventory_status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Inventory Admin</p>
                    <p className={`text-xs ${getStatusColor(requisition.inventory_status)}`}>
                      {requisition.inventory_status || "Pending"}
                    </p>
                    {requisition.inventory_approved_at && (
                      <p className="text-xs text-gray-400">{new Date(requisition.inventory_approved_at).toLocaleString()}</p>
                    )}
                    {requisition.inventory_remarks && (
                      <p className="text-xs text-gray-600 mt-1">"{requisition.inventory_remarks}"</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Office Use Information */}
            {(requisition.voucher_number || requisition.material_issued_on || requisition.store_incharge) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Office Use Information</h3>
                
                <div className="space-y-3">
                  {requisition.voucher_number && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Voucher Number</label>
                      <p className="text-sm text-gray-900">{requisition.voucher_number}</p>
                    </div>
                  )}
                  
                  {requisition.material_issued_on && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Material Issued On</label>
                      <p className="text-sm text-gray-900">{new Date(requisition.material_issued_on).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  {requisition.store_incharge && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Store Incharge</label>
                      <p className="text-sm text-gray-900">{requisition.store_incharge}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Defective Material</label>
                    <p className="text-sm text-gray-900">{requisition.defective_material_received || "No"}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisitionView;