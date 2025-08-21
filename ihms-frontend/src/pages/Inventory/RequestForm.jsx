import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/iul green logo.jpg";
import { useNavigate } from "react-router-dom";
import { Printer, Save, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const RequestForm = () => {
  const printRef = useRef();
  const [currentUser, setCurrentUser] = useState(null);
  const [formNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [items, setItems] = useState([]);
  const [hodList, setHodList] = useState([]);
  const [storeInchargeList, setStoreInchargeList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // success, error, null
  const [validationErrors, setValidationErrors] = useState({});

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [formRows, setFormRows] = useState([
    {
      item_id: "",
      type: "",
      itemname: "",
      requiredQty: "",
      availableQty: "",
      issuedQty: "",
      balQty: "",
      remarks: ""
    }
  ]);

  const [formData, setFormData] = useState({
    department: "General Medicine",
    date: new Date().toISOString().split("T")[0],
    month: new Date().toLocaleString("default", { month: "long" }),
    materialTypes: [],
    requirementTypes: [],
    justification: ""
  });

  const [signatureData, setSignatureData] = useState({
    hodName: "",
    hodSignDate: "",
    deanName: "",
    deanSignDate: "",
    pvcName: "",
    pvcSignDate: "",
    vcName: "",
    vcSignDate: "",
    requestReceivedOn: "",
    procurementOfficer: "",
    procurementSignature: "",
    procurementSignDate: "",
    materialIssuedOn: "",
    voucherNo: "",
    defectiveMaterialReceived: "No",
    storeIncharge: "",
    storeSignature: "",
    storeSignDate: ""
  });

  const navigate = useNavigate();
  
  // ✅ Check user permissions
  const isIncharge = currentUser?.role === "Incharge";
  const isAdmin = currentUser?.role === "Inventory Admin";
  const canCreateRequisition = isIncharge || isAdmin;

  // ✅ Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await res.json();
        console.log("✅ Current user:", userData);
        setCurrentUser(userData);

        // ✅ Set department from user data and lock it for Incharge
        if (userData.department) {
          setFormData(prev => ({ ...prev, department: userData.department }));
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // ✅ Check permissions and redirect if needed
  useEffect(() => {
    if (currentUser && !canCreateRequisition) {
      alert("Only Incharge or Inventory Admin can create requisitions");
      navigate("/inventory/requisition");
    }
  }, [currentUser, canCreateRequisition, navigate]);

  // ✅ Fetch inventory items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:8001/inventory/items");
        if (!res.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await res.json();
        console.log("✅ Items fetched:", data.length);
        setItems(data);
      } catch (error) {
        console.error("❌ Error fetching items:", error);
        setValidationErrors(prev => ({ ...prev, items: "Failed to load inventory items" }));
      }
    };

    fetchItems();
  }, []);

  // ✅ Fetch HOD for department
  useEffect(() => {
    if (formData.department && formData.department !== "Department A") {
      fetchHodForDepartment(formData.department);
    }
  }, [formData.department]);

  // ✅ Fetch store incharge list
  useEffect(() => {
    fetchStoreInchargeList();
  }, []);

  // ✅ Set default signatures based on user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "Inventory Admin") {
        setSignatureData((prev) => ({ 
          ...prev, 
          storeIncharge: currentUser.name,
          procurementOfficer: currentUser.name
        }));
      }
    }
  }, [currentUser]);

  const fetchHodForDepartment = async (department) => {
    try {
      const response = await fetch(`http://localhost:8000/auth/users?role=HOD&department=${encodeURIComponent(department)}`);
      if (response.ok) {
        const data = await response.json();
        setHodList(data);

        if (data.length === 1) {
          setSignatureData(prev => ({ ...prev, hodName: data[0].name }));
        } else if (data.length === 0) {
          setSignatureData(prev => ({ ...prev, hodName: `HOD - ${department}` }));
        }
      } else {
        setSignatureData(prev => ({ ...prev, hodName: `HOD - ${department}` }));
      }
    } catch (error) {
      console.error("Failed to fetch HOD:", error);
      setSignatureData(prev => ({ ...prev, hodName: `HOD - ${department}` }));
    }
  };

  const fetchStoreInchargeList = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/users?role=Inventory Admin");
      if (response.ok) {
        const data = await response.json();
        setStoreInchargeList(data);

        if (data.length > 0) {
          setSignatureData(prev => ({
            ...prev,
            storeIncharge: data[0].name,
            procurementOfficer: data[0].name
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch store incharge list:", error);
    }
  };

  const handleAddRow = () => {
    setFormRows([
      ...formRows,
      {
        item_id: "",
        type: "",
        itemname: "",
        requiredQty: "",
        availableQty: "",
        issuedQty: "",
        balQty: "",
        remarks: ""
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    if (formRows.length > 1) {
      const updatedRows = formRows.filter((_, i) => i !== index);
      setFormRows(updatedRows);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...formRows];
    updatedRows[index][field] = value;

    if (field === "itemname") {
      const selectedItem = items.find((i) => i.itemname === value);
      if (selectedItem) {
        updatedRows[index].item_id = selectedItem.id;
        updatedRows[index].type = selectedItem.type;
        updatedRows[index].availableQty = selectedItem.qty;
        
        // ✅ Recalculate balance when item changes
        const issued = parseInt(updatedRows[index].issuedQty) || 0;
        updatedRows[index].balQty = selectedItem.qty - issued;
      }
    }

    if (field === "issuedQty") {
      const available = parseInt(updatedRows[index].availableQty) || 0;
      const issued = parseInt(value) || 0;
      updatedRows[index].balQty = available - issued;
    }

    if (field === "requiredQty") {
      // ✅ Clear validation error when user starts typing
      if (validationErrors.items) {
        setValidationErrors(prev => ({ ...prev, items: null }));
      }
    }

    setFormRows(updatedRows);
  };

  const handleSignatureChange = (field, value) => {
    setSignatureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ Enhanced validation with detailed error reporting
  const validateForm = () => {
    const errors = {};

    // Check if at least one item is selected
    const validItems = formRows.filter(row => row.item_id && row.requiredQty > 0);
    if (validItems.length === 0) {
      errors.items = "Please add at least one item with required quantity";
    }

    // Check for duplicate items
    const itemIds = validItems.map(row => row.item_id);
    const duplicateItems = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
    if (duplicateItems.length > 0) {
      errors.duplicateItems = "Please remove duplicate items";
    }

    // Check if material types are selected
    if (formData.materialTypes.length === 0) {
      errors.materialTypes = "Please select at least one material type";
    }

    // Check if requirement types are selected
    if (formData.requirementTypes.length === 0) {
      errors.requirementTypes = "Please select at least one requirement type";
    }

    // Check for required quantities that are too high
    const insufficientStock = validItems.filter(row => 
      parseInt(row.requiredQty) > parseInt(row.availableQty)
    );
    if (insufficientStock.length > 0) {
      errors.insufficientStock = `Insufficient stock for: ${insufficientStock.map(item => item.itemname).join(', ')}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Save as draft function
  const handleSaveDraft = () => {
    const draftData = {
      formData,
      formRows,
      signatureData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`requisition_draft_${formNo}`, JSON.stringify(draftData));
    alert("Draft saved locally! You can continue editing later.");
  };

  // ✅ Load draft function
  const loadDraft = () => {
    const draftKey = `requisition_draft_${formNo}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData.formData);
        setFormRows(draftData.formRows);
        setSignatureData(draftData.signatureData);
        alert("Draft loaded successfully!");
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  };

  const handleSubmit = async () => {
    // ✅ Validate form first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // ✅ Filter out empty rows and prepare items
      const validItems = formRows
        .filter(row => row.item_id && row.requiredQty > 0)
        .map((row) => ({
          item_id: parseInt(row.item_id),
          requiredQty: parseInt(row.requiredQty),
          issuedQty: parseInt(row.issuedQty) || 0,
          remarks: row.remarks || "",
          // ✅ Include frontend fields for mapping
          type: row.type,
          itemname: row.itemname,
          availableQty: parseInt(row.availableQty) || 0,
          balQty: parseInt(row.balQty) || 0
        }));

      // ✅ Prepare payload with proper data types
      const payload = {
        department: formData.department,
        date: formData.date,
        month: formData.month,
        material_types: formData.materialTypes,
        requirement_types: formData.requirementTypes,
        justification: formData.justification || "",
        items: validItems,
        
        // ✅ Office use fields (only if admin)
        ...(isAdmin && {
          material_issued_on: signatureData.materialIssuedOn ? new Date(signatureData.materialIssuedOn).toISOString() : null,
          voucher_number: signatureData.voucherNo || null,
          defective_material_received: signatureData.defectiveMaterialReceived || "No",
          store_incharge: signatureData.storeIncharge || null,
        })
      };

      console.log("📤 Submitting payload:", JSON.stringify(payload, null, 2));

      const response = await fetch("http://localhost:8001/inventory/requisition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log("📥 Response status:", response.status);
      const responseText = await response.text();
      console.log("📥 Response body:", responseText);

      if (!response.ok) {
        throw new Error(`Requisition submission failed: ${responseText}`);
      }

      const result = JSON.parse(responseText);
      console.log("✅ Requisition created:", result);

      // ✅ Clear draft and show success
      localStorage.removeItem(`requisition_draft_${formNo}`);
      setSubmitStatus('success');
      
      // ✅ Auto redirect after success message
      setTimeout(() => {
        navigate("/inventory/requisition");
      }, 3000);

    } catch (error) {
      console.error("❌ Error submitting requisition:", error);
      setSubmitStatus('error');
      setValidationErrors(prev => ({ 
        ...prev, 
        submit: `Failed to submit requisition: ${error.message}` 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Show loading state while user data is being fetched
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading user information...</p>
        </div>
      </div>
    );
  }

  // ✅ Show permission denied message
  if (!canCreateRequisition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">Only Incharge or Inventory Admin can create requisitions.</p>
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

  return (
    <div className="p-6 bg-white max-w-6xl mx-auto text-sm">
      {/* ✅ Enhanced header with actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Requisition</h1>
          <p className="text-gray-600">Form No: {formNo} | User: {currentUser.name} ({currentUser.role})</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 text-gray-700 hover:text-black px-3 py-2 bg-gray-200 rounded"
            title="Save Draft"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-gray-700 hover:text-black px-3 py-2 bg-gray-200 rounded"
            title="Print Form"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* ✅ Status messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <div>
              <h4 className="text-green-800 font-medium">Requisition submitted successfully!</h4>
              <p className="text-green-600 text-sm">Redirecting to requisitions list in 3 seconds...</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <div>
              <h4 className="text-red-800 font-medium">Submission failed</h4>
              <p className="text-red-600 text-sm">{validationErrors.submit}</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Validation errors display */}
      {Object.keys(validationErrors).length > 0 && submitStatus !== 'error' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-500 mr-2 mt-0.5" size={20} />
            <div>
              <h4 className="text-yellow-800 font-medium">Please fix the following issues:</h4>
              <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside">
                {Object.values(validationErrors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div ref={printRef}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <img src={logo} alt="Integral Logo" className="h-16" />
          <div className="text-center flex-grow">
            <p className="text-xl font-bold">Requisition Form</p>
            <p className="text-xs text-gray-800">(For Procurement of Materials)</p>
          </div>
          <div className="text-sm text-right font-semibold">
            Integral University<br />Kursi Road, Lucknow-226026
            <div className="text-sm font-semibold">Form No: {formNo}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold">Department:</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 p-2 w-full border rounded"
              disabled={currentUser?.role === "Incharge"} // ✅ Lock for Incharge
            >
              {[
                "Anatomy", "Anesthesia", "Biochemistry", "Community Medicine", "Dentistry",
                "Dermatology, Ven. & Lep.", "ENT", "Forensic Medicine", "General Medicine",
                "General Surgery", "Microbiology", "Obstetrics & Gynecology", "Ophthalmology",
                "Orthopedics", "Pathology", "Pediatrics", "Pharmacology", "Physiology",
                "Psychiatry", "Radiology", "TB & Chest", "Casualty & Emergency Medicine"
              ].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {currentUser?.role === "Incharge" && (
              <p className="text-xs text-gray-500 mt-1">Department locked to your assignment</p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Month:</label>
            <input
              type="month"
              value={`${new Date(formData.date).getFullYear()}-${(
                "0" +
                (new Date(formData.date).getMonth() + 1)
              ).slice(-2)}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                const updatedDate = new Date(formData.date);
                updatedDate.setFullYear(+year);
                updatedDate.setMonth(+month - 1);
                setFormData({
                  ...formData,
                  date: updatedDate.toISOString().split("T")[0],
                  month: updatedDate.toLocaleString("default", { month: "long" })
                });
              }}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
        </div>

        <div className="flex gap-6 mb-4">
          <div>
            <p className="font-semibold">Material Type: <span className="text-red-500">*</span></p>
            {validationErrors.materialTypes && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.materialTypes}</p>
            )}
            {["Consumables", "Non Consumables", "Capital"].map((material_types) => (
              <label key={material_types} className="block">
                <input
                  type="checkbox"
                  value={material_types}
                  checked={formData.materialTypes.includes(material_types)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      materialTypes: checked
                        ? [...prev.materialTypes, material_types]
                        : prev.materialTypes.filter((t) => t !== material_types)
                    }));
                    // Clear validation error
                    if (validationErrors.materialTypes) {
                      setValidationErrors(prev => ({ ...prev, materialTypes: null }));
                    }
                  }}
                />{" "}
                {material_types}
              </label>
            ))}
          </div>
          <div>
            <p className="font-semibold">Material Requirement: <span className="text-red-500">*</span></p>
            {validationErrors.requirementTypes && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.requirementTypes}</p>
            )}
            {["Monthly", "Quarterly", "Semester/Yearly"].map((requirement_types) => (
              <label key={requirement_types} className="block">
                <input
                  type="checkbox"
                  value={requirement_types}
                  checked={formData.requirementTypes.includes(requirement_types)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      requirementTypes: checked
                        ? [...prev.requirementTypes, requirement_types]
                        : prev.requirementTypes.filter((r) => r !== requirement_types)
                    }));
                    // Clear validation error
                    if (validationErrors.requirementTypes) {
                      setValidationErrors(prev => ({ ...prev, requirementTypes: null }));
                    }
                  }}
                />{" "}
                {requirement_types}
              </label>
            ))}
          </div>
        </div>

        {/* ✅ Enhanced table with better validation feedback */}
        <div className="overflow-x-auto">
          {validationErrors.items && (
            <p className="text-red-500 text-sm mb-2">{validationErrors.items}</p>
          )}
          {validationErrors.duplicateItems && (
            <p className="text-red-500 text-sm mb-2">{validationErrors.duplicateItems}</p>
          )}
          {validationErrors.insufficientStock && (
            <p className="text-yellow-600 text-sm mb-2">{validationErrors.insufficientStock}</p>
          )}
          <table className="min-w-full border border-gray-300 text-xs text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">S.No</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Item Name <span className="text-red-500">*</span></th>
                <th className="border px-2 py-1">Required Qty <span className="text-red-500">*</span></th>
                <th className="border px-2 py-1">Available Qty</th>
                <th className="border px-2 py-1">Issued Qty</th>
                <th className="border px-2 py-1">Bal. Qty</th>
                <th className="border px-2 py-1">Remarks</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {formRows.map((row, index) => (
                <tr key={index} className={row.requiredQty > row.availableQty ? "bg-yellow-50" : ""}>
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{row.type || "-"}</td>
                  <td className="border px-2 py-1">
                    <select
                      className="w-full border p-1 rounded"
                      value={row.itemname}
                      onChange={(e) => handleRowChange(index, "itemname", e.target.value)}
                    >
                      <option value="">-- Select Item --</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.itemname}>
                          {item.itemname}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={row.requiredQty}
                      onChange={(e) => handleRowChange(index, "requiredQty", e.target.value)}
                      className={`w-full outline-none ${
                        row.requiredQty > row.availableQty ? "bg-yellow-100" : ""
                      }`}
                      placeholder="Qty"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">{row.availableQty || "-"}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      value={row.issuedQty}
                      onChange={(e) => handleRowChange(index, "issuedQty", e.target.value)}
                      className="w-full outline-none"
                      disabled={!isAdmin}
                      placeholder="0"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">{row.balQty || "-"}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) => handleRowChange(index, "remarks", e.target.value)}
                      className="w-full outline-none"
                      placeholder="Optional"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    {formRows.length > 1 && (
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRow} className="mt-2 text-blue-600 hover:underline text-sm">
            + Add Item
          </button>
        </div>

        {/* Justification */}
        <div className="mt-4">
          <label className="block font-semibold">Justification for Large Quantity:</label>
          <textarea
            className="w-full border mt-1 p-2 rounded"
            placeholder="In case of the above mentioned material (items) required in huge quantity, please justify the uses:"
            value={formData.justification}
            onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          />
        </div>

        {/* Enhanced Approval & Signature Section with Workflow Information */}
        <div className="mt-6 text-sm text-gray-800">
          <div className="border border-gray-300 p-4 rounded-md space-y-4">
            {/* ✅ Workflow Information */}
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2">Approval Workflow</h4>
              <div className="text-xs text-blue-700">
                <p><strong>Step 1:</strong> Incharge creates requisition (You are here)</p>
                <p><strong>Step 2:</strong> HOD reviews and approves/rejects</p>
                <p><strong>Step 3:</strong> Dean reviews and approves/rejects</p>
                <p><strong>Step 4:</strong> Competent Authority reviews and approves/rejects</p>
                <p><strong>Step 5:</strong> Purchase Officer (PO) reviews and approves/rejects</p>
                <p><strong>Step 6:</strong> Inventory Admin processes and issues materials</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Approval Process:</p>
                
                {/* HOD Section with Input Fields */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-xs font-medium">H.O.D. / Incharge Name:</label>
                    <input
                      type="text"
                      value={signatureData.hodName}
                      onChange={(e) => handleSignatureChange('hodName', e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1 bg-gray-100"
                      placeholder="Auto-filled based on department"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Signature of HOD:</label>
                    <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1 bg-gray-50 flex items-center justify-center text-gray-400">
                      [Digital signature after approval]
                    </div>
                  </div>
                </div>

                <br />

                {/* Dean Section with Input Fields */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium">Dean / Director / MS:</label>
                    <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1 bg-gray-50 flex items-center justify-center text-gray-400">
                      [To be filled during approval]
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Date:</label>
                    <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1 bg-gray-50 flex items-center justify-center text-gray-400">
                      [Auto-filled on approval]
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">Approved/Not Approved</p>
                <p className="text-xs text-gray-500 mt-1">Status will be updated automatically</p>
              </div>
            </div>

            {/* PVC and VC Section with Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Competent Authority:</label>
                <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1 bg-gray-50 flex items-center justify-center text-gray-400">
                  [Digital approval system]
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Purchase Officer:</label>
                <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1 bg-gray-50 flex items-center justify-center text-gray-400">
                  [Digital approval system]
                </div>
              </div>
            </div>

            <div className="text-[13px] mt-3 bg-yellow-50 p-3 rounded">
              <p className="font-semibold">Important Notes:</p>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>
                  <strong>For procuring Machinery, Equipment & Lab Chemicals,</strong> approval by Competent Authority is mandatory.
                </li>
                <li>
                  Please use separate requisition for different material types (consumables, non-consumables, capital).
                </li>
                <li>
                  In case of non-consumables, defective material should be returned.
                </li>
                <li>
                  All approvals will be tracked digitally through the system.
                </li>
              </ol>
            </div>

            {/* Enhanced Office Use Only Section - Only for Inventory Admin */}
            {isAdmin && ( 
              <div className="mt-4 border-t pt-3">
                <p className="text-center font-semibold text-gray-600">For Office Use Only</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="mb-2">
                      <label className="text-xs font-medium">Request received on:</label>
                      <input
                        type="date"
                        value={signatureData.requestReceivedOn}
                        onChange={(e) => handleSignatureChange('requestReceivedOn', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-xs font-medium">Procurement Officer:</label>
                      <input
                        type="text"
                        value={signatureData.procurementOfficer}
                        onChange={(e) => handleSignatureChange('procurementOfficer', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                        placeholder="Enter procurement officer name"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-xs font-medium">Material Issued on:</label>
                      <input
                        type="date"
                        value={signatureData.materialIssuedOn}
                        onChange={(e) => handleSignatureChange('materialIssuedOn', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-xs font-medium">Voucher No.:</label>
                      <input
                        type="text"
                        value={signatureData.voucherNo}
                        onChange={(e) => handleSignatureChange('voucherNo', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                        placeholder="Enter voucher number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2">
                      <label className="text-xs font-medium">Defective material received:</label>
                      <select
                        value={signatureData.defectiveMaterialReceived}
                        onChange={(e) => handleSignatureChange('defectiveMaterialReceived', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="text-xs font-medium">Store Incharge:</label>
                      <select
                        value={signatureData.storeIncharge}
                        onChange={(e) => handleSignatureChange('storeIncharge', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                      >
                        <option value="">Select Incharge</option>
                        {storeInchargeList.map((admin, index) => (
                          <option key={index} value={admin.name}>
                            {admin.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Signature Date:</label>
                      <input
                        type="date"
                        value={signatureData.storeSignDate}
                        onChange={(e) => handleSignatureChange('storeSignDate', e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Enhanced submit section with better UX */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p><strong>Created by:</strong> {currentUser.name} ({currentUser.role})</p>
            <p><strong>Department:</strong> {currentUser.department}</p>
            <p><strong>Form Number:</strong> {formNo}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/inventory/requisition")}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Save Draft
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded text-white font-medium ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Requisition"
              )}
            </button>
          </div>
        </div>
        
        {/* ✅ Submission info */}
        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p><strong>What happens next:</strong></p>
          <p>1. Your requisition will be sent to {signatureData.hodName || "HOD"} for approval</p>
          <p>2. You will receive email notifications for status updates</p>
          <p>3. You can track the approval progress in the Requisitions page</p>
          <p>4. The system will automatically route the requisition through the complete approval workflow</p>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;