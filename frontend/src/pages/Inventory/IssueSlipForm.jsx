import React, { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IssueSlipForm = () => {
  const navigate = useNavigate();
  const [slipNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    date: new Date().toISOString().split("T")[0],
    issuedItems: [
      {
        itemname: "",
        qty: 0,
        remarks: ""
      }
    ]
  });

//   useEffect(() => {
//     fetch("http://localhost:8001/inventory/items")
//       .then((res) => res.json())
//       .then((data) => setItems(data))
//       .catch(console.error);
//   }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.issuedItems];
    updatedItems[index][field] = value;
    setFormData({ ...formData, issuedItems: updatedItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      issuedItems: [
        ...formData.issuedItems,
        { itemname: "", qty: 0, remarks: "" }
      ]
    });
  };

  const handleSubmit = () => {
    const payload = { ...formData, slipNo };
    fetch("http://localhost:8001/stock/issue-slip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Issue slip submitted successfully!");
        navigate("/stock");
      })
      .catch(console.error);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white text-sm">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Issue Slip</h2>
        <button
          onClick={() => window.print()}
          className="text-gray-700 hover:text-black w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
          title="Print Form"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold">Department:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-semibold">Date:</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Item Name</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {formData.issuedItems.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">
                  <select
                    value={item.itemname}
                    onChange={(e) => handleItemChange(idx, "itemname", e.target.value)}
                    className="w-full border rounded"
                  >
                    <option value="">-- Select Item --</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.itemname}>
                        {i.itemname}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                    className="w-full border rounded"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => handleItemChange(idx, "remarks", e.target.value)}
                    className="w-full border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addItemRow} className="mt-2 text-blue-600 hover:underline text-sm">
          + Add Item
        </button>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Issue Slip
        </button>
      </div>
    </div>
  );
};

export default IssueSlipForm;
