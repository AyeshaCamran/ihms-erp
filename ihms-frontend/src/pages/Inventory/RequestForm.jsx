import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/iul green logo.jpg";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const RequestForm = () => {
  const printRef = useRef();
  const [currentUser, setCurrentUser] = useState(null);
  const [formNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [items, setItems] = useState([]);
  const [hodList, setHodList] = useState([]);
  const [storeInchargeList, setStoreInchargeList] = useState([]);

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
    department: "Department A",
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
  const isHOD = currentUser?.role === "HOD";
  const isAdmin = currentUser?.role === "Inventory Admin";

  useEffect(() => {
    fetch("http://localhost:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8001/inventory/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.department && formData.department !== "Department A") {
      fetchHodForDepartment(formData.department);
    }
  }, [formData.department]);

  useEffect(() => {
    fetchStoreInchargeList();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (token) {
      fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.role === "HOD") {
            setSignatureData((prev) => ({ ...prev, hodName: data.name }));
          }
          if (data.role === "Inventory Admin") {
            setSignatureData((prev) => ({ ...prev, storeIncharge: data.name }));
          }
        })
        .catch(console.error);
    }
  }, []);

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
      } else {
        setSignatureData(prev => ({
          ...prev,
          storeIncharge: "Store Incharge",
          procurementOfficer: "Procurement Officer"
        }));
      }
    } catch (error) {
      console.error("Failed to fetch store incharge list:", error);
      setSignatureData(prev => ({
        ...prev,
        storeIncharge: "Store Incharge",
        procurementOfficer: "Procurement Officer"
      }));
    }
  };

  const handleAddRow = () => {
    setFormRows([
      ...formRows,
      {
        item_id: null,
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

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...formRows];
    updatedRows[index][field] = value;

    if (field === "itemname") {
      const selectedItem = items.find((i) => i.itemname === value);
      if (selectedItem) {
        updatedRows[index].item_id = selectedItem.id;
        updatedRows[index].type = selectedItem.type;
        updatedRows[index].availableQty = selectedItem.qty;
        updatedRows[index].balQty = selectedItem.qty - (updatedRows[index].issuedQty || 0);
      }
    }

    if (field === "issuedQty") {
      const available = parseInt(updatedRows[index].availableQty) || 0;
      const issued = parseInt(value) || 0;
      updatedRows[index].balQty = available - issued;
    }

    setFormRows(updatedRows);
  };

  const handleSignatureChange = (field, value) => {
    setSignatureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
  const token = localStorage.getItem("token"); // ✅ Fetch token from localStorage

  const payload = {
    ...formData,
    ...signatureData,
    items: formRows.map((row) => ({
      item_id: row.item_id,
      requiredQty: parseInt(row.requiredQty),
      issuedQty: parseInt(row.issuedQty) || 0,
      remarks: row.remarks,

      // ✅ Include these only if needed by frontend
      type: row.type,
      itemname: row.itemname,
      availableQty: row.availableQty,
      balQty: row.balQty
    }))
  };

  fetch("http://localhost:8001/inventory/requisition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // ✅ Add token here
    },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Requisition submission failed");
      }
      return res.json();
    })
    .then(() => {
      alert("Requisition submitted successfully!");
      navigate("/inventory/requisition");
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to submit requisition. Please check console for details.");
    });
};


  return (
    <div className="p-6 bg-white max-w-6xl mx-auto text-sm">
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handlePrint}
          className="text-gray-700 hover:text-black w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
          title="Print Form"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>
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
          >
            {[
              "Anatomy", "Anesthesia", "Biochemistry", "Community Medicine", "Dentistry",
              "Dermatology, Ven. & Lep.", "ENT", "Forensic Medicine", "General Medicine",
              "General Surgery", "Microbiology", "Obstetrics & Gynecology", "Ophthalmology",
              "Orthopedics", "Pathology", "Pediatrics", "Pharmacology", "Physiology",
              "Psychiatry", "Radiology", "TB & Chest", "Casuality & Emergency Medicine"
            ].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
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
          <p className="font-semibold">Material Type:</p>
          {["Consumables", "Non Consumables", "Capital"].map((material_types) => (
            <label key={material_types} className="block">
              <input
                type="checkbox"
                value={material_types}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    materialTypes: checked
                      ? [...prev.materialTypes, material_types]
                      : prev.materialTypes.filter((t) => t !== material_types)
                  }));
                }}
              />{" "}
              {material_types}
            </label>
          ))}
        </div>
        <div>
          <p className="font-semibold">Material Requirement:</p>
          {["Monthly", "Quarterly", "Semester/Yearly"].map((requirement_types) => (
            <label key={requirement_types} className="block">
              <input
                type="checkbox"
                value={requirement_types}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    requirementTypes: checked
                      ? [...prev.requirementTypes, requirement_types]
                      : prev.requirementTypes.filter((r) => r !== requirement_types)
                  }));
                }}
              />{" "}
              {requirement_types}
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Item Name</th>
              <th className="border px-2 py-1">Required Qty</th>
              <th className="border px-2 py-1">Available Qty</th>
              <th className="border px-2 py-1">Issued Qty</th>
              <th className="border px-2 py-1">Bal. Qty</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {formRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{row.type || "-"}</td>
                <td className="border px-2 py-1">
                  <select
                    className="w-full border p-1 rounded"
                    value={row.itemname}
                    onChange={(e) => handleRowChange(index, "itemname", e.target.value)}
                  >
                    <option value="">-- Select --</option>
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
                    value={row.requiredQty}
                    onChange={(e) => handleRowChange(index, "requiredQty", e.target.value)}
                    className="w-full outline-none"
                  />
                </td>
                <td className="border px-2 py-1 text-center">{row.availableQty || "-"}</td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={row.issuedQty}
                    onChange={(e) => handleRowChange(index, "issuedQty", e.target.value)}
                    className="w-full outline-none"
                    disabled={isHOD}

                  />
                </td>
                <td className="border px-2 py-1 text-center">{row.balQty || "-"}</td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.remarks}
                    onChange={(e) => handleRowChange(index, "remarks", e.target.value)}
                    className="w-full outline-none"
                    disabled={isHOD}

                  />
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

      {/* Enhanced Approval & Signature Section with Input Fields */}
      <div className="mt-6 text-sm text-gray-800">
        <div className="border border-gray-300 p-4 rounded-md space-y-4">
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
                    className="w-full border border-gray-300 px-2 py-1 text-xs rounded mt-1"
                    placeholder="Auto-filled"
                  />
                </div>
                <div>
                    <label className="text-xs font-medium">Signature of HOD:</label>
                    <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1" />
                </div>
              </div>

              <br />

              {/* Dean Section with Input Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">Dean / Director / MS:</label>
                  <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1" />

                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">Approved/Not Approved</p>
            </div>
          </div>

          {/* PVC and VC Section with Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium">PVC:</label>
              <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1" />

            </div>
            <div>
              <label className="text-xs font-medium">VC:</label>
              <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1" />

            </div>
          </div>

          <div className="text-[13px] mt-3">
            <p className="font-semibold">Note:</p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>
                <strong>For procuring Machinery, Equipments & Lab Chemicals,</strong> it is
                mandatory to approve by PVC.
              </li>
              <li>
                Please use separate sheet for consumables, non consumables, capital etc.
              </li>
              <li>
                In case of non consumables defective material should be returned.
              </li>
            </ol>
          </div>

          {/* Enhanced Office Use Only Section with Input Fields */}
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
                  <div className="w-full border border-gray-300 px-2 py-1 text-xs rounded h-6.5 mt-1" />
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
      

      

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default RequestForm;