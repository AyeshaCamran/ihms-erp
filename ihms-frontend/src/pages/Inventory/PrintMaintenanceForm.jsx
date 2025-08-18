import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/iul green logo.jpg";

const PrintMaintenanceForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:8001/inventory/maintenance/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(console.error);
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Maintenance_Form_${id}`,
  });

  if (!formData) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 bg-white max-w-4xl mx-auto text-sm">
      {/* Print button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="text-gray-700 hover:text-black w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
          title="Print Form"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* Printable content */}
      <div ref={printRef} className="printable-area p-6 bg-white border rounded shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <img src={logo} alt="Logo" className="h-16" />
          <div className="text-center flex-grow">
            <p className="text-xl font-bold">Maintenance Request Form</p>
            <p className="text-xs text-gray-800">Integral University, Kursi Road, Lucknow-226026</p>
          </div>
          <div className="text-right font-semibold">
            <p>Form No: {formData.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <p><strong>Complaint No.:</strong> {formData.complaint_no}</p>
          <p><strong>Date:</strong> {formData.date}</p>
          <p><strong>Emp. Code:</strong> {formData.emp_code}</p>
          <p><strong>Name of Complaint:</strong> {formData.complaint}</p>
          <p><strong>Department:</strong> {formData.department}</p>
        </div>

        <div className="mb-4">
          <p><strong>Nature of Maintenance:</strong> {formData.nature_of_maintenance}</p>
          <p><strong>Type of Maintenance:</strong> {formData.type_of_maintenance}</p>
        </div>

        <div className="mb-4">
          <p className="font-semibold">Description of Work:</p>
          <p className="border p-2 mt-1">{formData.description}</p>
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
              <p>Complaint No.: __________________________</p>
              <p className="mt-2">Date of Receipt: __________________________</p>
            </div>
            <div>
              <p>Signature of Receiver / Maintenance Incharge:</p>
              <div className="border h-10 mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintMaintenanceForm;
