import React, { useState } from "react";
import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiXCircle, FiFilter, FiSearch } from "react-icons/fi";

// ✨ STYLED EXACTLY LIKE FIGMA DESIGN SYSTEM ✨
const Panel = ({ title, children, gradient = "from-slate-50 to-blue-50/30", headerIcon = null }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
    {/* Header with gradient - matches Figma cards */}
    <div className={`px-6 py-4 bg-gradient-to-r ${gradient} border-b border-slate-100/50 relative overflow-hidden`}>
      {/* Decorative elements from design system */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/20 rounded-full"></div>
      
      <div className="flex items-center gap-3 relative z-10">
        {headerIcon && (
          <div className="w-8 h-8 rounded-lg bg-[#A2F2EE] text-[#233955] flex items-center justify-center">
            {headerIcon}
          </div>
        )}
        <h3 className="font-bold text-base text-[#233955] group-hover:text-blue-800 transition-colors duration-300">
          {title}
        </h3>
      </div>
      <div className="w-16 h-0.5 bg-gradient-to-r from-[#233955] to-[#A2F2EE] rounded-full mt-2"></div>
    </div>
    
    {/* Content */}
    <div className="p-6 text-sm text-[#4B4D4F] relative">
      {children}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'approved': { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: <FiCheckCircle size={14} /> },
    'pending': { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <FiClock size={14} /> },
    'rejected': { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: <FiXCircle size={14} /> }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg} ${config.border} border`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState('apply');
  
  // Sample leave data
  const leaveRequests = [
    {
      id: 1,
      type: 'Casual Leave',
      startDate: '2025-08-28',
      endDate: '2025-08-30',
      days: 3,
      reason: 'Personal work',
      status: 'pending',
      appliedOn: '2025-08-25'
    },
    {
      id: 2,
      type: 'Earned Leave',
      startDate: '2025-09-15',
      endDate: '2025-09-20',
      days: 6,
      reason: 'Family vacation',
      status: 'approved',
      appliedOn: '2025-08-20'
    },
    {
      id: 3,
      type: 'Medical Leave',
      startDate: '2025-08-10',
      endDate: '2025-08-12',
      days: 3,
      reason: 'Health checkup',
      status: 'rejected',
      appliedOn: '2025-08-05'
    }
  ];

  const leaveBalance = {
    casual: { used: 5, total: 12 },
    earned: { used: 8, total: 21 },
    medical: { used: 2, total: 7 },
    maternity: { used: 0, total: 180 }
  };

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
        active
          ? 'bg-[#233955] text-white shadow-lg'
          : 'text-[#4B4D4F] hover:bg-[#A2F2EE] hover:text-[#233955]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#233955] mb-2">Leave Management</h1>
          <p className="text-[#4B4D4F]">Manage your leave applications and track balances</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#A2F2EE] text-[#233955] rounded-lg hover:bg-[#233955] hover:text-white transition-all duration-200 font-medium">
            <FiPlus size={16} />
            Apply Leave
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 inline-flex gap-1 border border-[#E6E6E7]">
        <TabButton 
          id="apply" 
          label="Apply Leave" 
          active={activeTab === 'apply'} 
          onClick={() => setActiveTab('apply')} 
        />
        <TabButton 
          id="history" 
          label="Leave History" 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
        />
        <TabButton 
          id="balance" 
          label="Leave Balance" 
          active={activeTab === 'balance'} 
          onClick={() => setActiveTab('balance')} 
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Application Form */}
          <div className="lg:col-span-2">
            <Panel title="Apply for Leave" gradient="from-blue-50 to-indigo-50" headerIcon={<FiCalendar />}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#233955] mb-2">Leave Type</label>
                    <select className="w-full px-4 py-3 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all">
                      <option>Select leave type</option>
                      <option>Casual Leave</option>
                      <option>Earned Leave</option>
                      <option>Medical Leave</option>
                      <option>Maternity Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#233955] mb-2">Duration</label>
                    <select className="w-full px-4 py-3 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all">
                      <option>Full Day</option>
                      <option>Half Day (Morning)</option>
                      <option>Half Day (Evening)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#233955] mb-2">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#233955] mb-2">End Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">Reason</label>
                  <textarea 
                    rows="4"
                    placeholder="Please provide reason for leave application..."
                    className="w-full px-4 py-3 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#233955] text-white rounded-lg hover:bg-[#1a2a40] transition-all duration-200 font-medium"
                  >
                    Submit Application
                  </button>
                  <button 
                    type="button"
                    className="px-6 py-3 border border-[#E6E6E7] text-[#4B4D4F] rounded-lg hover:bg-[#F0F0F0] transition-all duration-200"
                  >
                    Save Draft
                  </button>
                </div>
              </form>
            </Panel>
          </div>

          {/* Quick Balance Overview */}
          <div className="space-y-6">
            <Panel title="Leave Balance" gradient="from-green-50 to-emerald-50" headerIcon={<FiCheckCircle />}>
              <div className="space-y-4">
                {Object.entries(leaveBalance).map(([type, balance]) => (
                  <div key={type} className="p-4 bg-white/50 rounded-lg border border-white/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#233955] capitalize">
                        {type.replace('_', ' ')} Leave
                      </span>
                      <span className="text-xs text-[#4B4D4F]">
                        {balance.used}/{balance.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#233955] to-[#A2F2EE] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(balance.used / balance.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-[#4B4D4F] mt-1">
                      <span>Used: {balance.used}</span>
                      <span>Remaining: {balance.total - balance.used}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <Panel title="Leave History" gradient="from-purple-50 to-indigo-50" headerIcon={<FiClock />}>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 pb-4 border-b border-[#E6E6E7]">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B4D4F]" size={16} />
                  <input 
                    type="text"
                    placeholder="Search leave requests..."
                    className="w-full pl-10 pr-4 py-2 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select className="px-4 py-2 border border-[#E6E6E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2F2EE] focus:border-[#233955] transition-all">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <button className="p-2 border border-[#E6E6E7] rounded-lg hover:bg-[#F0F0F0] transition-all">
                  <FiFilter size={16} />
                </button>
              </div>
            </div>

            {/* Leave requests list */}
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <div 
                  key={request.id}
                  className="p-4 bg-white/70 rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-[#233955] group-hover:text-blue-700 transition-colors">
                          {request.type}
                        </h4>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="text-sm text-[#4B4D4F] space-y-1">
                        <p><strong>Duration:</strong> {request.startDate} to {request.endDate} ({request.days} days)</p>
                        <p><strong>Reason:</strong> {request.reason}</p>
                        <p><strong>Applied on:</strong> {request.appliedOn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-2 text-xs bg-[#A2F2EE] text-[#233955] rounded-lg hover:bg-[#233955] hover:text-white transition-all">
                        View Details
                      </button>
                      {request.status === 'pending' && (
                        <button className="px-3 py-2 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <Panel 
              key={type}
              title={`${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Leave`}
              gradient="from-teal-50 to-cyan-50"
              headerIcon={<FiCalendar />}
            >
              <div className="space-y-4">
                {/* Progress ring/circle */}
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        className="text-[#233955]"
                        d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${(balance.used / balance.total) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#233955]">{balance.total - balance.used}</div>
                        <div className="text-xs text-[#4B4D4F]">Remaining</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-xl font-bold text-[#233955]">{balance.total}</div>
                    <div className="text-xs text-[#4B4D4F]">Total Allocated</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="text-xl font-bold text-[#233955]">{balance.used}</div>
                    <div className="text-xs text-[#4B4D4F]">Used</div>
                  </div>
                </div>

                {/* Usage percentage */}
                <div className="text-center text-sm text-[#4B4D4F]">
                  Usage: {((balance.used / balance.total) * 100).toFixed(1)}%
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}