// src/pages/Inventory/MaterialVoucherForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Save, ArrowLeft, Printer } from "lucide-react";

const MaterialVoucherForm = () => {
  const navigate = useNavigate();
  const { id: voucherId } = useParams();
  const location = useLocation();
  const isEdit = Boolean(voucherId);
  
  // Get requisition data from navigation state (when coming from purchase page)
  const requisitionData = location.state?.requisition;

  // State management
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Form data - Material Issuing Voucher format
  const [formData, setFormData] = useState({
    voucher_no: "", // Auto-generated
    date: new Date().toISOString().split('T')[0],
    req_form_no: "", // From requisition form
    req_date: "",
    authorised_by: "",
    procurement_officer: "",
    material_issued_by: "", // Store Keeper (Inventory Admin)
    store_keeper: "",
    received_by_name: "",
    received_by_signature: "",
    received_by_emp_code: "",
    material_status: "complete", // complete/partial/balance
    material_condition: "intact", // intact and satisfactory condition
    note_1: "No material can be taken outside the University premises through this voucher.",
    note_2: "Non material will be used until the requisition form is properly approved"
  });

  // Get current user and determine role
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // Pre-fill based on user role - Purchase Office creates material vouchers
        if (user.role === "PO") {
          setFormData(prev => ({
            ...prev,
            procurement_officer: "", // This is just a name field, not the PO role
            material_issued_by: "", // Store Keeper name will be filled manually
            store_keeper: "" // Store Keeper name will be filled manually
          }));
        }
      } catch {
        setCurrentUser({ name: userData, role: "PO" });
      }
    }
  }, []);

  // Load requisition data if provided
  useEffect(() => {
    if (requisitionData) {
      setFormData(prev => ({
        ...prev,
        req_form_no: `REQ-${requisitionData.id}`,
        req_date: new Date(requisitionData.date).toLocaleDateString(),
        authorised_by: requisitionData.created_by || ""
      }));
    }
  }, [requisitionData]);

  // Load voucher data for editing
  useEffect(() => {
    if (isEdit && voucherId) {
      loadVoucherData();
    }
  }, [isEdit, voucherId]);

  const loadVoucherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8001/inventory/material-vouchers/${voucherId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to load material voucher data");
      }

      const voucher = await response.json();
      
      // Set form data
      setFormData({
        voucher_no: voucher.voucher_no || "",
        date: voucher.date ? voucher.date.split('T')[0] : "",
        req_form_no: voucher.req_form_no || "",
        req_date: voucher.req_date ? new Date(voucher.req_date).toISOString().split('T')[0] : "",
        authorised_by: voucher.authorised_by || "",
        procurement_officer: voucher.procurement_officer || "",
        material_issued_by: voucher.material_issued_by || "",
        store_keeper: voucher.store_keeper || "",
        received_by_name: voucher.received_by_name || "",
        received_by_signature: voucher.received_by_signature || "",
        received_by_emp_code: voucher.received_by_emp_code || "",
        material_status: voucher.material_status || "complete",
        material_condition: voucher.material_condition || "intact",
        note_1: voucher.note_1 || "No material can be taken outside the University premises through this voucher.",
        note_2: voucher.note_2 || "Non material will be used until the requisition form is properly approved"
      });

    } catch (error) {
      console.error("Error loading material voucher:", error);
      setValidationErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
  const errors = {};

  // Required field validations
  if (!formData.req_form_no.trim()) {
    errors.req_form_no = "Requisition form number is required";
  }
  if (!formData.authorised_by.trim()) {
    errors.authorised_by = "Authorised by field is required";
  }
  if (!formData.procurement_officer.trim()) {
    errors.procurement_officer = "Procurement officer is required";
  }
  if (!formData.material_issued_by.trim()) {  // Missing validation
    errors.material_issued_by = "Material issued by field is required";
  }
  if (!formData.store_keeper.trim()) {  // Missing validation
    errors.store_keeper = "Store keeper field is required";
  }
  if (!formData.received_by_name.trim()) {
    errors.received_by_name = "Received by name is required";
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare payload
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      const url = isEdit 
        ? `http://localhost:8001/inventory/material-vouchers/${voucherId}`
        : "http://localhost:8001/inventory/material-vouchers";
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${isEdit ? 'update' : 'create'} material voucher`);
      }

      const result = await response.json();
      console.log(`✅ Material Voucher ${isEdit ? 'updated' : 'created'}:`, result);

      setSubmitStatus('success');
      
      // Update the voucher number if creating new
      if (!isEdit && result.voucher_no) {
        setFormData(prev => ({ ...prev, voucher_no: result.voucher_no }));
      }
      
      // Redirect after success
      setTimeout(() => {
        navigate("/inventory/purchase");
      }, 2000);

    } catch (error) {
      console.error("❌ Error submitting material voucher:", error);
      setSubmitStatus('error');
      setValidationErrors(prev => ({ 
        ...prev, 
        submit: error.message 
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (loading && isEdit) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading material voucher data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 no-print">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/inventory/purchase")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Material Voucher" : "Create Material Issuing Voucher"}
            </h2>
            <p className="text-gray-600">
              {isEdit ? "Update material voucher details" : "Create a new material issuing voucher"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Saving...' : (isEdit ? 'Update Voucher' : 'Create Voucher')}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Printer size={16} />
            Print
          </button>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mt-4">
            <p>✅ Material voucher {isEdit ? 'updated' : 'created'} successfully! Redirecting...</p>
          </div>
        )}

        {submitStatus === 'error' && validationErrors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
            <p>❌ {validationErrors.submit}</p>
          </div>
        )}
      </div>

      {/* Voucher Form - Matches the image exactly */}
      <div className="bg-white border-2 border-black p-6 print:border-black print:p-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-start mb-4">
            {/* University Logo/Seal placeholder */}
            <div className="w-20 h-20 border border-black rounded-full flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
            
            {/* Center Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold">INTEGRAL UNIVERSITY</h1>
              <p className="text-sm">Kursi Road, Lucknow-226026 Uttar Pradesh (India)</p>
              <h2 className="text-xl font-bold mt-2 underline">Material Issuing Voucher</h2>
              <p className="text-sm">(For Internal use only)</p>
            </div>
            
            {/* Right side info */}
            <div className="text-right text-sm">
              <div className="mb-4">
                <label className="block font-medium">Req.Form No.</label>
                <input
                  type="text"
                  value={formData.req_form_no}
                  onChange={(e) => handleFormChange('req_form_no', e.target.value)}
                  className={`border-b border-black bg-transparent text-center w-32 ${
                    validationErrors.req_form_no ? 'border-red-500' : ''
                  }`}
                  placeholder="REQ-XXX"
                />
                {validationErrors.req_form_no && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.req_form_no}</p>
                )}
              </div>
              <div>
                <label className="block font-medium">Date :</label>
                <input
                  type="text"
                  value={formData.req_date}
                  onChange={(e) => handleFormChange('req_date', e.target.value)}
                  className="border-b border-black bg-transparent text-center w-32"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Details */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="font-medium">Voucher No.: </label>
              <input
                type="text"
                value={formData.voucher_no}
                onChange={(e) => handleFormChange('voucher_no', e.target.value)}
                className="border-b border-black bg-transparent ml-2 w-20"
                placeholder="23002"
                readOnly={!isEdit} // Auto-generated for new vouchers
              />
            </div>
            <div>
              <label className="font-medium">Date : </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className="border-b border-black bg-transparent ml-2"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6">
          <p className="mb-4">Please issue material against above mentioned requisition form No.</p>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Authorised By :</label>
                <input
                  type="text"
                  value={formData.authorised_by}
                  onChange={(e) => handleFormChange('authorised_by', e.target.value)}
                  className={`w-full border-b border-black bg-transparent ${
                    validationErrors.authorised_by ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter name"
                />
                {validationErrors.authorised_by && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.authorised_by}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Procurement officer :</label>
                <input
                  type="text"
                  value={formData.procurement_officer}
                  onChange={(e) => handleFormChange('procurement_officer', e.target.value)}
                  className={`w-full border-b border-black bg-transparent ${
                    validationErrors.procurement_officer ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter procurement officer name"
                />
                {validationErrors.procurement_officer && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.procurement_officer}</p>
                )}
              </div>

              <div className="mt-6">
                <p className="mb-2">I have received 
                  <select
                    value={formData.material_status}
                    onChange={(e) => handleFormChange('material_status', e.target.value)}
                    className="mx-2 border-b border-black bg-transparent"
                  >
                    <option value="complete">complete</option>
                    <option value="partial">Partial</option>
                    <option value="balance">balance</option>
                  </select>
                  material against above mentioned requisition Form No.
                </p>
                <p>The received material is in 
                  <select
                    value={formData.material_condition}
                    onChange={(e) => handleFormChange('material_condition', e.target.value)}
                    className="mx-2 border-b border-black bg-transparent"
                  >
                    <option value="intact">intact and satisfactory condition</option>
                    <option value="damaged">damaged condition</option>
                    <option value="partial">partially intact condition</option>
                  </select>
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Material Issued By :</label>
                <input
                  type="text"
                  value={formData.material_issued_by}
                  onChange={(e) => handleFormChange('material_issued_by', e.target.value)}
                  className="w-full border-b border-black bg-transparent"
                  placeholder="Store Keeper name"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Store Keeper :</label>
                <input
                  type="text"
                  value={formData.store_keeper}
                  onChange={(e) => handleFormChange('store_keeper', e.target.value)}
                  className="w-full border-b border-black bg-transparent"
                  placeholder="Store Keeper name"
                />
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block font-medium mb-1">Received By :</label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm">Signature :</label>
                      <input
                        type="text"
                        value={formData.received_by_signature}
                        onChange={(e) => handleFormChange('received_by_signature', e.target.value)}
                        className="w-full border-b border-black bg-transparent"
                        placeholder="Signature"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Name :</label>
                      <input
                        type="text"
                        value={formData.received_by_name}
                        onChange={(e) => handleFormChange('received_by_name', e.target.value)}
                        className={`w-full border-b border-black bg-transparent ${
                          validationErrors.received_by_name ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter name"
                      />
                      {validationErrors.received_by_name && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.received_by_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm">Emp. Code :</label>
                      <input
                        type="text"
                        value={formData.received_by_emp_code}
                        onChange={(e) => handleFormChange('received_by_emp_code', e.target.value)}
                        className="w-full border-b border-black bg-transparent"
                        placeholder="Employee code"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="border-t border-black pt-4">
          <h3 className="font-bold mb-2">Note :</h3>
          <div className="space-y-1 text-sm">
            <p>1. {formData.note_1}</p>
            <p>2. {formData.note_2}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialVoucherForm;