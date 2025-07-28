import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import ReactToPrint from "react-to-print";

const IndentForm = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const [indentNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [formData, setFormData] = useState({
    department: "",
    date: new Date().toISOString().split("T")[0],
    items: [
      {
        particulars: "",
        code: "",
        qtyRequired: "",
        qtyIssued: "",
        balance: "",
        remarks: ""
      }
    ]
  });

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "qtyRequired" || field === "qtyIssued") {
      const req = parseInt(updatedItems[index].qtyRequired || 0);
      const iss = parseInt(updatedItems[index].qtyIssued || 0);
      updatedItems[index].balance = req - iss;
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          particulars: "",
          code: "",
          qtyRequired: "",
          qtyIssued: "",
          balance: "",
          remarks: ""
        }
      ]
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">New Indent Form</h2>
        <div className="flex gap-2">
          <ReactToPrint
            trigger={() => (
              <button className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                <Printer size={16} />
              </button>
            )}
            content={() => componentRef.current}
          />
          <button
            onClick={() => navigate("/inventory/indent")}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div ref={componentRef} className="bg-white border p-4 shadow-sm rounded">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="font-medium">Department:</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full border rounded p-1 mt-1"
            />
          </div>
          <div>
            <label className="font-medium">Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border rounded p-1 mt-1"
            />
          </div>
          <div>
            <label className="font-medium">Indent No:</label>
            <input
              type="text"
              value={indentNo}
              disabled
              className="w-full border bg-gray-100 rounded p-1 mt-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">S.No</th>
                <th className="border p-1">Particulars</th>
                <th className="border p-1">Code</th>
                <th className="border p-1">Qty Required</th>
                <th className="border p-1">Qty Issued</th>
                <th className="border p-1">Balance</th>
                <th className="border p-1">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-1 text-center">{idx + 1}</td>
                  <td className="border p-1">
                    <input
                      value={item.particulars}
                      onChange={(e) => handleItemChange(idx, "particulars", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      value={item.code}
                      onChange={(e) => handleItemChange(idx, "code", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={item.qtyRequired}
                      onChange={(e) => handleItemChange(idx, "qtyRequired", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={item.qtyIssued}
                      onChange={(e) => handleItemChange(idx, "qtyIssued", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-1 text-center">
                    {item.balance || 0}
                  </td>
                  <td className="border p-1">
                    <input
                      value={item.remarks}
                      onChange={(e) => handleItemChange(idx, "remarks", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItemRow}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={() => alert("Indent form saved! (Backend not connected)")}
        >
          Submit Indent
        </button>
      </div>
    </div>
  );
};

export default IndentForm;
