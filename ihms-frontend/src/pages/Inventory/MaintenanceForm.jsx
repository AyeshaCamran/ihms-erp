// import React, { useState } from "react";
// import logo from "../../assets/iul green logo.jpg";
// import { useNavigate } from "react-router-dom";
// import { Printer } from "lucide-react";

// const MaintenanceForm = () => {
//   const [formNo] = useState(Math.floor(10000 + Math.random() * 90000));
//   const [formData, setFormData] = useState({
//     complaintNo: 0,
//     date: new Date().toISOString().split("T")[0],
//     empCode: "",
//     complaint: "",  // ✅ final and correct
//     department: "",
//     natureOfMaintenance: "",
//     typeOfMaintenance: "",
//     description: ""
//   });

//   const navigate = useNavigate();

//   const handleCheckbox = (field, value) => {
//     setFormData((prev) => {
//       const isChecked = prev[field].includes(value);
//       const updated = isChecked
//         ? prev[field].filter((v) => v !== value)
//         : [...prev[field], value];
//       return { ...prev, [field]: updated };
//     });
//   };

//   const handleSubmit = () => {
//     fetch("http://localhost:8001/maintenance", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData)
//     })
//       .then((res) => res.json())
//       .then(() => {
//         alert("Maintenance request submitted successfully!");
//         navigate("/inventory/maintenance");
//       })
//       .catch(console.error);
//   };

//   return (
//     <div className="p-6 bg-white max-w-4xl mx-auto text-sm">
//       <div className="flex justify-end items-center mb-6">
//         <button
//           onClick={() => window.print()}
//           className="text-gray-700 hover:text-black w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
//           title="Print Form"
//         >
//           <Printer className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="flex justify-between items-center mb-4 border-b pb-2">
//         <img src={logo} alt="Integral Logo" className="h-16" />
//         <div className="text-center flex-grow">
//           <p className="text-xl font-bold">Maintenance Request Form</p>
//           <p className="text-xs text-gray-800">Integral University, Kursi Road, Lucknow-226026</p>
//         </div>
//         <div className="text-sm text-right font-semibold">
//           Form No: {formNo}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <input
//           type="number"
//           placeholder="Complaint No."
//           value={formData.complaintNo}
//           onChange={(e) => setFormData({ ...formData, complaintNo: parseInt(e.target.value) || 0 })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           value={formData.date}
//           onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Emp. Code"
//           value={formData.empCode}
//           onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Name of Complaint"
//           value={formData.complaint}
//           onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Department"
//           value={formData.department}
//           onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//           className="border p-2 rounded"
//         />
//       </div>

//       <div className="mt-4">
//         <p className="font-semibold">Nature of Maintenance:</p>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
//           {["Planned", "Preventive", "Reactive/Breakdown", "Emergency"].map((type) => (
//             <label key={type} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={formData.natureOfMaintenance.includes(type)}
//                 onChange={() => handleCheckbox("natureOfMaintenance", type)}
//                 className="mr-2"
//               />
//               {type}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="mt-4">
//         <p className="font-semibold">Type of Maintenance:</p>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
//           {["Civil", "Electrical", "Mechanical", "Plumbing", "Sanitary", "Carpentary", "Welding", "Painting", "Equipments/Instruments", "Fire Safety", "Others"].map((type) => (
//             <label key={type} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={formData.typeOfMaintenance.includes(type)}
//                 onChange={() => handleCheckbox("typeOfMaintenance", type)}
//                 className="mr-2"
//               />
//               {type}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6">
//         <label className="font-semibold">Brief Description of Repair or Maintenance Work Required:</label>
//         <textarea
//           rows={5}
//           className="w-full border p-2 rounded mt-2"
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//         />
//       </div>

//       <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
//         <div>
//           <label className="block font-semibold">Signature of Complainant:</label>
//           <div className="border h-10 mt-1" />
//         </div>
//         <div>
//           <label className="block font-semibold">Concerned Head/Incharge:</label>
//           <div className="border h-10 mt-1" />
//         </div>
//       </div>

//       <div className="mt-8 p-4 border-t text-sm">
//         <h4 className="font-bold mb-2">FOR OFFICE USE ONLY</h4>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block">Complaint No.:</label>
//             <div className="border h-10 mt-1" />
//           </div>
//           <div>
//             <label className="block">Date of Receipt:</label>
//             <div className="border h-10 mt-1" />
//           </div>
//         </div>
//         <div className="mt-4">
//           <label className="block">Signature of Receiver / Maintenance Incharge:</label>
//           <div className="border h-10 mt-1" />
//         </div>
//       </div>

//       <div className="mt-6 text-right">
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           Submit Request
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MaintenanceForm;


import React, { useState } from "react";
import logo from "../../assets/iul green logo.jpg";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";

const MaintenanceForm = () => {
  const [formNo] = useState(Math.floor(10000 + Math.random() * 90000));
  const [formData, setFormData] = useState({
    complaint_no: 0,
    date: new Date().toISOString().split("T")[0],
    emp_code: "",
    complaint: "",
    department: "Department A",
    nature_of_maintenance: "",
    type_of_maintenance: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://localhost:8001/inventory/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Maintenance request submitted successfully!");
        navigate("/inventory/maintenance");
      })
      .catch(console.error);
  };

  return (
    <div className="p-6 bg-white max-w-4xl mx-auto text-sm">
      <div className="flex justify-end mb-6">
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
          <p className="text-xl font-bold">Maintenance Request Form</p>
          <p className="text-xs text-gray-800">Integral University, Kursi Road, Lucknow-226026</p>
        </div>
        <div className="text-sm text-right font-semibold">Form No: {formNo}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
       <input
          type="number"
          placeholder="Complaint No."
          value={formData.complaint_no}
          onChange={(e) =>
          setFormData({ ...formData, complaint_no: parseInt(e.target.value) || "" })}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Emp. Code"
          value={formData.emp_code}
          onChange={(e) => setFormData({ ...formData, emp_code: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Name of Complainant"
          value={formData.complaint}
          onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="border p-2 rounded"
        >
          {Array.from({ length: 26 }, (_, i) => (
            <option key={i} value={`Department ${String.fromCharCode(65 + i)}`}>
              Department {String.fromCharCode(65 + i)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Nature of Maintenance:</p>
        {["Planned", "Preventive", "Reactive/Breakdown", "Emergency"].map((type) => (
          <label key={type} className="block">
            <input
              type="radio"
              name="nature"
              value={type}
              checked={formData.nature_of_maintenance === type}
              onChange={(e) => setFormData({ ...formData, nature_of_maintenance: e.target.value })}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>

      <div className="mt-4">
        <p className="font-semibold">Type of Maintenance:</p>
        {[
          "Civil", "Electrical", "Mechanical", "Plumbing", "Sanitary",
          "Carpentary", "Welding", "Painting", "Equipments/Instruments", "Fire Safety", "Others"
        ].map((type) => (
          <label key={type} className="block">
            <input
              type="radio"
              name="type"
              value={type}
              checked={formData.type_of_maintenance === type}
              onChange={(e) => setFormData({ ...formData, type_of_maintenance: e.target.value })}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>

      <div className="mt-6">
        <label className="font-semibold">Brief Description of Work Required:</label>
        <textarea
          rows={5}
          className="w-full border p-2 rounded mt-2"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block font-semibold">Signature of Complainant:</label>
          <div className="border h-10 mt-1" />
        </div>
        <div>
          <label className="block font-semibold">Concerned Head/Incharge:</label>
          <div className="border h-10 mt-1" />
        </div>
      </div>

      <div className="mt-8 p-4 border-t text-sm">
        <h4 className="font-bold mb-2">FOR OFFICE USE ONLY</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Complaint No.:</label>
            <div className="border h-10 mt-1" />
          </div>
          <div>
            <label className="block">Date of Receipt:</label>
            <div className="border h-10 mt-1" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block">Signature of Receiver / Maintenance Incharge:</label>
          <div className="border h-10 mt-1" />
        </div>
      </div>

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

export default MaintenanceForm;
