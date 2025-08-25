// src/pages/Inventory/VoucherForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

const VoucherForm = () => {
  const navigate = useNavigate();
  const { id: voucherId } = useParams();
  const isEdit = Boolean(voucherId);

  // State management
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Form data
  const [formData, setFormData] = useState({
    vendor_name: "",
    vendor_address: "",
    vendor_gst: "",
    vendor_contact: "",
    po_number: "",
    invoice_number: "",
    invoice_date: "",
    bill_amount: "",
    payment_mode: "",
    cheque_number: "",
    bank_name: "",
    remarks: ""
  });

  // Items data
  const [items, setItems] = useState([
    {
      item_name: "",
      item_description: "",
      quantity: "",
      unit_price: "",
      total_amount: ""
    }
  ]);

  // Get current user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch {
        setCurrentUser({ name: userData, role: "PO" });
      }
    }
  }, []);

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
      
      const response = await fetch(`http://localhost:8001/inventory/vouchers/${voucherId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to load voucher data");
      }

      const voucher = await response.json();
      
      // Set form data
      setFormData({
        vendor_name: voucher.vendor_name || "",
        vendor_address: voucher.vendor_address || "",
        vendor_gst: voucher.vendor_gst || "",
        vendor_contact: voucher.vendor_contact || "",
        po_number: voucher.po_number || "",
        invoice_number: voucher.invoice_number || "",
        invoice_date: voucher.invoice_date ? voucher.invoice_date.split('T')[0] : "",
        bill_amount: voucher.bill_amount || "",
        payment_mode: voucher.payment_mode || "",
        cheque_number: voucher.cheque_number || "",
        bank_name: voucher.bank_name || "",
        remarks: voucher.remarks || ""
      });

      // Set items
      if (voucher.items && voucher.items.length > 0) {
        setItems(voucher.items.map(item => ({
          item_name: item.item_name || "",
          item_description: item.item_description || "",
          quantity: item.quantity || "",
          unit_price: item.unit_price || "",
          total_amount: item.total_amount || ""
        })));
      }

    } catch (error) {
      console.error("Error loading voucher:", error);
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

    // Auto-calculate bill amount when items change
    if (field === "bill_amount") {
      calculateTotalAmount();
    }
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Auto-calculate total amount for the item
    if (field === "quantity" || field === "unit_price") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unit_price) || 0;
      updatedItems[index].total_amount = (quantity * unitPrice).toFixed(2);
    }

    setItems(updatedItems);
    calculateTotalAmount(updatedItems);
  };

  // Calculate total bill amount
  const calculateTotalAmount = (itemsList = items) => {
    const total = itemsList.reduce((sum, item) => {
      return sum + (parseFloat(item.total_amount) || 0);
    }, 0);
    
    setFormData(prev => ({
      ...prev,
      bill_amount: total.toFixed(2)
    }));
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, {
      item_name: "",
      item_description: "",
      quantity: "",
      unit_price: "",
      total_amount: ""
    }]);
  };

  // Remove item row
  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      calculateTotalAmount(updatedItems);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Basic validations
    if (!formData.vendor_name.trim()) {
      errors.vendor_name = "Vendor name is required";
    }

    if (!formData.bill_amount || parseFloat(formData.bill_amount) <= 0) {
      errors.bill_amount = "Valid bill amount is required";
    }

    // Item validations
    const itemErrors = [];
    items.forEach((item, index) => {
      const itemError = {};
      
      if (!item.item_name.trim()) {
        itemError.item_name = "Item name is required";
      }
      
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        itemError.quantity = "Valid quantity is required";
      }
      
      if (!item.unit_price || parseFloat(item.unit_price) <= 0) {
        itemError.unit_price = "Valid unit price is required";
      }

      if (Object.keys(itemError).length > 0) {
        itemErrors[index] = itemError;
      }
    });

    if (itemErrors.length > 0) {
      errors.items = itemErrors;
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
        bill_amount: parseFloat(formData.bill_amount),
        invoice_date: formData.invoice_date ? new Date(formData.invoice_date).toISOString() : null,
        items: items.map(item => ({
          item_name: item.item_name,
          item_description: item.item_description || "",
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
          total_amount: parseFloat(item.total_amount)
        }))
      };

      const url = isEdit 
        ? `http://localhost:8001/inventory/vouchers/${voucherId}`
        : "http://localhost:8001/inventory/vouchers";
      
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
        throw new Error(errorData.detail || `Failed to ${isEdit ? 'update' : 'create'} voucher`);
      }

      const result = await response.json();
      console.log(`✅ Voucher ${isEdit ? 'updated' : 'created'}:`, result);

      setSubmitStatus('success');
      
      // Redirect after success
      setTimeout(() => {
        navigate("/inventory/purchase");
      }, 2000);

    } catch (error) {
      console.error("❌ Error submitting voucher:", error);
      setSubmitStatus('error');
      setValidationErrors(prev => ({ 
        ...prev, 
        submit: error.message 
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading voucher data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/inventory/purchase")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Voucher" : "Add New Voucher"}
            </h2>
            <p className="text-gray-600">
              {isEdit ? "Update voucher details" : "Create a new purchase voucher"}
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            <p>✅ Voucher {isEdit ? 'updated' : 'created'} successfully! Redirecting...</p>
          </div>
        )}

        {submitStatus === 'error' && validationErrors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>❌ {validationErrors.submit}</p>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Voucher Header */}
        <div className="text-center mb-6 pb-4 border-b">
          <h3 className="text-xl font-bold">Purchase Voucher</h3>
          <p className="text-sm text-gray-600">
            {isEdit ? `Voucher ID: ${voucherId}` : "Auto-generated voucher number will be assigned"}
          </p>
        </div>

        {/* Vendor Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Vendor Information</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vendor_name}
                  onChange={(e) => handleFormChange('vendor_name', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    validationErrors.vendor_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
                {validationErrors.vendor_name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.vendor_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Address</label>
                <textarea
                  value={formData.vendor_address}
                  onChange={(e) => handleFormChange('vendor_address', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Enter vendor address"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={formData.vendor_gst}
                    onChange={(e) => handleFormChange('vendor_gst', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="GST number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-