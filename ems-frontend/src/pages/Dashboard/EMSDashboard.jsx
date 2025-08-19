import React from "react";

const Panel = ({ title, children, gradient = "from-slate-50 to-blue-50/30" }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
    {/* Header with gradient */}
    <div className={`px-6 py-4 bg-gradient-to-r ${gradient} border-b border-slate-100/50 relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/20 rounded-full"></div>
      
      <h3 className="font-bold text-base text-slate-800 relative z-10 group-hover:text-blue-800 transition-colors duration-300">
        {title}
      </h3>
      <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2"></div>
    </div>
    
    {/* Content with enhanced styling */}
    <div className="p-6 text-sm text-slate-700 relative">
      {children}
    </div>
  </div>
);

export default function EMSDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts + Notices (two cols) */}
        <div className="lg:col-span-2 space-y-8">
          <Panel title="ALERTS" gradient="from-red-50 to-orange-50">
            <div className="space-y-3">
              {[
                { text: "Update Aadhaar Number", priority: "high" },
                { text: "Rejected Leave Applications (0)", priority: "medium" },
                { text: "Partially Approved Leave Applications (0)", priority: "medium" },
                { text: "Closed Grievances (0)", priority: "low" }
              ].map((alert, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl border-l-4 transition-all duration-200 hover:translate-x-2 ${
                    alert.priority === 'high' 
                      ? 'bg-red-50 border-red-500 text-red-800' 
                      : alert.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                      : 'bg-green-50 border-green-500 text-green-800'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    alert.priority === 'high' 
                      ? 'bg-red-500' 
                      : alert.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}></div>
                  <span className="font-medium">{alert.text}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="NOTICES" gradient="from-blue-50 to-indigo-50">
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-center font-medium">No notices available at the moment</p>
              <p className="text-sm text-slate-400">Check back later for updates</p>
            </div>
          </Panel>
        </div>

        {/* Right column: Leave Application Guideline */}
        <div className="lg:col-span-1">
          <Panel title="LEAVE APPLICATION GUIDELINE" gradient="from-green-50 to-emerald-50">
            <div className="space-y-6 text-xs leading-relaxed">
              {[
                {
                  title: "1: Casual Leave",
                  color: "text-blue-700",
                  bgColor: "bg-blue-50",
                  borderColor: "border-blue-200",
                  rules: [
                    "Casual Leave may not be granted for more than 3 days at a time.",
                    "Casual Leave cannot be combined with any other type of leave."
                  ]
                },
                {
                  title: "2: Earned Leave",
                  color: "text-green-700",
                  bgColor: "bg-green-50",
                  borderColor: "border-green-200",
                  rules: [
                    "Leave application for EL is to be made at least two weeks in advance.",
                    "EL shall not be granted more than three times in a year.",
                    "EL shall not be granted for less than 4 days at a time.",
                    "Sunday/holiday falling between EL shall also be treated as leave for example…"
                  ]
                },
                {
                  title: "3: Medical Leave",
                  color: "text-orange-700",
                  bgColor: "bg-orange-50",
                  borderColor: "border-orange-200",
                  rules: ["Submit with full supporting documents; finalized by health committee."]
                },
                {
                  title: "4: Maternity Leave",
                  color: "text-purple-700",
                  bgColor: "bg-purple-50",
                  borderColor: "border-purple-200",
                  rules: ["Apply at least three months in advance with a certificate by a qualified gynecologist."]
                }
              ].map((section, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl ${section.bgColor} border ${section.borderColor} hover:shadow-md transition-all duration-200`}
                >
                  <h4 className={`font-bold ${section.color} mb-3`}>{section.title}</h4>
                  <ul className="space-y-2">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`}></div>
                        <span className="text-slate-700 leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}