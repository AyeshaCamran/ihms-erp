import React from "react";

const Panel = ({ title, children }) => (
  <div className="bg-white border border-[#E6E6E7] rounded-lg shadow-sm">
    <div className="px-4 py-2 bg-[#E6E6E7] font-semibold text-sm">{title}</div>
    <div className="p-4 text-sm text-[#05080B]">{children}</div>
  </div>
);

export default function EMSDashboard() {
  return (
    <div className="flex gap-6">
      {/* Left profile rail */}
      <div className="hidden lg:block">
        {/* <ProfileCard /> */}
      </div>

      {/* Main panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts + Notices (two cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title="ALERTS">
            <ul className="list-disc pl-5 space-y-1">
              <li>Update Aadhaar Number</li>
              <li>Rejected Leave Applications (0)</li>
              <li>Partially Approved Leave Applications (0)</li>
              <li>Closed Grievances (0)</li>
            </ul>
          </Panel>

          <Panel title="NOTICES">
            <div className="h-40 text-gray-500 flex items-center justify-center">No notices.</div>
          </Panel>
        </div>

        {/* Right column: Leave Application Guideline */}
        <div className="lg:col-span-1">
          <Panel title="LEAVE APPLICATION GUIDELINE">
            <div className="space-y-3 text-xs leading-5">
              <div>
                <b>1: Casual Leave -</b>
                <ul className="list-disc pl-5">
                  <li>Casual Leave may not be granted for more than 3 days at a time.</li>
                  <li>Casual Leave cannot be combined with any other type of leave.</li>
                </ul>
              </div>
              <div>
                <b>2: Earned Leave -</b>
                <ul className="list-disc pl-5">
                  <li>Leave application for EL is to be made at least two weeks in advance.</li>
                  <li>EL shall not be granted more than three times in a year.</li>
                  <li>EL shall not be granted for less than 4 days at a time.</li>
                  <li>Sunday/holiday falling between EL shall also be treated as leave for example…</li>
                </ul>
              </div>
              <div>
                <b>3: Medical Leave -</b> Submit with full supporting documents; finalized by health committee.
              </div>
              <div>
                <b>4: Maternity Leave -</b> Apply at least three months in advance with a certificate by a qualified gynecologist.
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
