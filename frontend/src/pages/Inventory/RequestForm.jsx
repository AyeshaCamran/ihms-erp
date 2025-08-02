import React, { useEffect, useState } from "react";
import logo from "../../assets/iul green logo.jpg";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";


const RequestForm = () => {
  const [formNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [items, setItems] = useState([]);
  const [formRows, setFormRows] = useState([
    {
      item_id: null, //edited
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

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8001/inventory/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(console.error);
  }, []);

  const handleAddRow = () => {
    setFormRows([
      ...formRows,
      {
        item_id: null, //edited
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
        updatedRows[index].item_id = selectedItem.id;  // ✅ Set item_id
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

  const handleSubmit = () => {
    const payload = {
      ...formData,
      items: formRows.map((row) => ({
        item_id: row.item_id,
        //type: row.type,
        //itemname: row.itemname,
        requiredQty: parseInt(row.requiredQty),
        //availableQty: parseInt(row.availableQty),
        issuedQty: parseInt(row.issuedQty) || 0,
        remarks: row.remarks
      }))
    };

    fetch("http://localhost:8001/inventory/requisition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Requisition submitted successfully!");
        navigate("/inventory/requisition");
      })
      .catch(console.error);
  };

  return (
    <div className="p-6 bg-white max-w-6xl mx-auto text-sm">
      <div className="flex justify-end items-center mb-6">
        <button
        onClick={() => window.print()}
        className="text-gray-700 hover:text-black w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
        title="Print Form"
        >
      <Printer className="w-5 h-5" />
      </button>
      </div>

    

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
          {["Consumables", "Non Consumables", "Capital"].map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                value={type}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    materialTypes: checked
                      ? [...prev.materialTypes, type]
                      : prev.materialTypes.filter((t) => t !== type)
                  }));
                }}
              />{" "}
              {type}
            </label>
          ))}
        </div>
        <div>
          <p className="font-semibold">Material Requirement:</p>
          {["Monthly", "Quarterly", "Semester/Yearly"].map((req) => (
            <label key={req} className="block">
              <input
                type="checkbox"
                value={req}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    requirementTypes: checked
                      ? [...prev.requirementTypes, req]
                      : prev.requirementTypes.filter((r) => r !== req)
                  }));
                }}
              />{" "}
              {req}
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
                  />
                </td>
                <td className="border px-2 py-1 text-center">{row.balQty || "-"}</td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.remarks}
                    onChange={(e) => handleRowChange(index, "remarks", e.target.value)}
                    className="w-full outline-none"
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

      {/* Approval & Signature Section */}
      <div className="mt-6 text-sm text-gray-800">
        <div className="border border-gray-300 p-4 rounded-md space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Approval Process:</p>
              <p>Sign. of H.O.D. / Incharge: __________________________</p>
              <p>Name: ________________________________________________</p><br></br>
              <p>Dean / Director / MS: __________________________</p>

            </div>
            <div className="text-right">
              <p className="font-semibold">Approved/Not Approved</p>
            </div>
          </div>
          <div className="flex justify-between">
            <p>PVC: __________________________________</p>
            <p>VC: __________________________________</p>
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
          <div className="mt-4 border-t pt-3">
            <p className="text-center font-semibold text-gray-600">For Office Use Only</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p>Requested received on: __________________________</p>
                <p className="mt-2">Procurement Officer: __________________________</p>
                <p>Signature: ______________________________________</p>
              </div>
              <div>
                <p>Material Issued on: __________________________</p>
                <p>Voucher No.: _________________________________</p>
                <p>Defective material recd.: Yes / No</p>
                <p className="mt-2">Store Incharge: __________________________</p>
                <p>Signature: __________________________________</p>
              </div>
            </div>
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
