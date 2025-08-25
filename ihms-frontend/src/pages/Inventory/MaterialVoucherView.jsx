import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Edit } from "lucide-react";

const MaterialVoucherView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const fetchVoucher = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8001/inventory/material-vouchers/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch material voucher");
      }

      const data = await response.json();
      setVoucher(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading material voucher...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Material voucher not found</p>
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
            <h2 className="text-2xl font-bold text-gray-800">Material Voucher Details</h2>
            <p className="text-gray-600">Voucher No: {voucher.voucher_no}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/inventory/purchase/material-voucher/edit/${id}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            Edit Voucher
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Voucher Display - Read-only version of the form */}
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
                <div className="border-b border-black text-center w-32 py-1">
                  {voucher.req_form_no}
                </div>
              </div>
              <div>
                <label className="block font-medium">Date :</label>
                <div className="border-b border-black text-center w-32 py-1">
                  {voucher.req_date}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Details */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="font-medium">Voucher No.: </label>
              <span className="border-b border-black ml-2 px-2 py-1">
                {voucher.voucher_no}
              </span>
            </div>
            <div>
              <label className="font-medium">Date : </label>
              <span className="border-b border-black ml-2 px-2 py-1">
                {new Date(voucher.date).toLocaleDateString()}
              </span>
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
                <div className="w-full border-b border-black py-1">
                  {voucher.authorised_by}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Procurement officer :</label>
                <div className="w-full border-b border-black py-1">
                  {voucher.procurement_officer}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2">I have received 
                  <span className="mx-2 border-b border-black px-2">
                    {voucher.material_status}
                  </span>
                  material against above mentioned requisition Form No.
                </p>
                <p>The received material is in 
                  <span className="mx-2 border-b border-black px-2">
                    {voucher.material_condition}
                  </span>
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Material Issued By :</label>
                <div className="w-full border-b border-black py-1">
                  {voucher.material_issued_by}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Store Keeper :</label>
                <div className="w-full border-b border-black py-1">
                  {voucher.store_keeper}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block font-medium mb-1">Received By :</label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm">Signature :</label>
                      <div className="w-full border-b border-black py-1">
                        {voucher.received_by_signature || '[Signature]'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">Name :</label>
                      <div className="w-full border-b border-black py-1">
                        {voucher.received_by_name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">Emp. Code :</label>
                      <div className="w-full border-b border-black py-1">
                        {voucher.received_by_emp_code || '-'}
                      </div>
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
            <p>1. {voucher.note_1}</p>
            <p>2. {voucher.note_2}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500 no-print">
          <p>Created on: {new Date(voucher.created_at).toLocaleString()}</p>
          {voucher.created_by && <p>Created by: {voucher.created_by}</p>}
          <p>Status: <span className="font-medium">{voucher.status}</span></p>
        </div>
      </div>
    </div>
  );
};

export default MaterialVoucherView;