import React from 'react';
import { 
  Users, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Clock, MapPin, Sparkles, PieChart, BarChart3
} from 'lucide-react';

export default function AnalyticsDashboard({ applications }) {
  const totalApps = applications.length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED' || a.status === 'MERIT_LISTED').length;
  const deficiencyCount = applications.filter(a => a.status === 'DEFICIENT' || a.status === 'DEFICIENCY_FLAGGED').length;
  const underScrutinyCount = applications.filter(a => a.status === 'UNDER_SCRUTINY').length;

  const totalSanctionedEst = (approvedCount * 7.5).toFixed(1); // Lakhs estimate

  // State distribution mock math
  const stateCounts = {
    "Jharkhand": 42,
    "Odisha": 38,
    "Chhattisgarh": 29,
    "Assam": 25,
    "Rajasthan": 21,
    "Madhya Pradesh": 19,
    "Telangana": 14
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Scheme Analytics & Insights</h2>
          <p className="text-xs text-slate-500">Real-time performance monitoring across Scheduled Tribe scholarship & fellowship schemes.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
            <Sparkles size={14} /> AI Scrutiny Accuracy: 97.8%
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Total Received Applications</span>
            <Users size={18} className="text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalApps + 1240}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> +18.4% vs previous financial year
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Approved & Sanctioned</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{approvedCount + 890}</div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {((approvedCount / (totalApps || 1)) * 100).toFixed(1)}% Approval Rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Deficiencies Flagged</span>
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{deficiencyCount + 142}</div>
          <div className="text-[11px] text-amber-600 font-semibold">
            92.4% Rectified via Digital Portal
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Avg Scrutiny Turnaround</span>
            <Clock size={18} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3.2 Days</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Down from 45 days (Manual Baseline)
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheme Distribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieChart size={18} className="text-amber-600" /> Application Distribution by Scheme
            </h3>
            <span className="text-xs text-slate-400 font-mono">FY 2025-26</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: "National Fellowship for ST (NFST)", count: 720, percentage: 58, color: "bg-blue-600" },
              { name: "National Overseas Scholarship (NOS)", count: 120, percentage: 10, color: "bg-amber-500" },
              { name: "Top Class Education Scheme (TCE)", count: 400, percentage: 32, color: "bg-emerald-600" }
            ].map((scheme, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{scheme.name}</span>
                  <span>{scheme.count} ({scheme.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${scheme.color} rounded-full`} style={{ width: `${scheme.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State-wise ST Distribution Bar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin size={18} className="text-amber-600" /> State-wise ST Application Volume
            </h3>
            <span className="text-xs text-slate-400 font-mono">Top Tribal States</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(stateCounts).map(([stateName, val], idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-28 font-semibold text-slate-700 truncate">{stateName}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: `${val * 2}%` }} />
                </div>
                <span className="w-8 font-mono font-bold text-right text-slate-900">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Intelligence Audit Trail Log */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
            <Sparkles size={18} /> Real-time AI Scrutiny Audit & Anomaly Detection Logs
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Live Governance Trail</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs font-mono">
          {[
            { time: "09:14:02", event: "Aadhaar vs Caste Cert Name Consistency Check", status: "MATCH 99.2%", badge: "VERIFIED" },
            { time: "09:02:18", event: "NOS Income Ceiling Rule Audit (Max ₹8.0L)", status: "PASS (₹5.1L)", badge: "PASS" },
            { time: "08:45:10", event: "OCR Fraud Scan on Caste Certificate JH/ST/2023/88412", status: "DIGITAL LOCKER VERIFIED", badge: "AUTHENTIC" },
            { time: "08:12:33", event: "NOS Offer Letter Condition Flagged", status: "CONDITIONAL DETECTED", badge: "DEFICIENCY" }
          ].map((log, idx) => (
            <div key={idx} className="py-2.5 flex justify-between items-center text-slate-300">
              <span className="text-slate-500">{log.time}</span>
              <span className="font-semibold text-slate-100">{log.event}</span>
              <span className="text-amber-300">{log.status}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-bold">
                {log.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
