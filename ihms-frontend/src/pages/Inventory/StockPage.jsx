import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Boxes,
  Building,
  AlertTriangle,
  Clock4,
  FileText,
  BookOpen,
  Send,
  Repeat,
  ArrowRightCircle
} from "lucide-react";

const StockPage = () => {
  const navigate = useNavigate();

  const summary = [
  {
    icon: <Boxes className="w-5 h-5 text-[#233955]" />,
    label: "Total Items",
    value: 238,
    route: "/inventory"
  },
  {
    icon: <Building className="w-5 h-5 text-[#233955]" />,
    label: "Departments",
    value: 12,
    route: "/departments"
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-[#233955]" />,
    label: "Low Stock",
    value: 7,
    route: "/stock/alerts?type=low"
  },
  {
    icon: <Clock4 className="w-5 h-5 text-[#233955]" />,
    label: "Expiring Items",
    value: 5,
    route: "/stock/alerts?type=expiry"
  },
  {
    icon: <FileText className="w-5 h-5 text-[#233955]" />,
    label: "Slips Today",
    value: 3,
    route: "/stock/issue-slip?filter=today"
  }
];


  const modules = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#4B4D4F]" />,
      title: "Stock Ledger",
      desc: "Track issues, receipts & updates",
      route: "/stock/ledger"
    },
    {
      icon: <Send className="w-6 h-6 text-[#4B4D4F]" />,
      title: "Issue Slips",
      desc: "Generate and print issue vouchers",
      route: "/inventory/stock/issue-slip"
    },
    {
      icon: <Repeat className="w-6 h-6 text-[#4B4D4F]" />,
      title: "Return Management",
      desc: "Handle damaged, expired or unused items",
      route: "/stock/returns"
    },
    {
      icon: <Send className="w-6 h-6 text-[#4B4D4F]" />,
      title: "Substore Transfer",
      desc: "Transfer items between stores or departments",
      route: "/stock/transfer"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-[#4B4D4F]" />,
      title: "Expiry/Shortage Alerts",
      desc: "Get notifications on low/expiring stock",
      route: "/stock/alerts"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Stock & Departmental Stores</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage all stock-related operations and inter-departmental transfers
      </p>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {summary.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(s.route)}
            className="cursor-pointer bg-[#F0F0F0] border border-transparent rounded-lg shadow-sm p-4 flex items-center gap-3 hover:bg-gray-50 transition"
          >
            <div className="bg-[#A2F2EE] p-3 rounded-full flex items-center justify-center w-10 h-10">
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-black font-semibold">{s.label}</p>
              <p className="text-base text-[#4B4D4F] font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
           

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modules.map((mod, idx) => (
          <div
            key={idx}
            onClick={() => navigate(mod.route)}
            className="cursor-pointer flex justify-between items-center p-5 bg-white border border-[#C3C4C4] rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
          <div className="flex items-center gap-4">
            <div className="bg-[#A2F2EE] p-3 rounded-xl flex items-center justify-center w-12 h-12">
              {mod.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {mod.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{mod.desc}</p>
            </div>
          </div>

            <ArrowRightCircle className="text-gray-400 hover:text-[#233955] w-5 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockPage;
