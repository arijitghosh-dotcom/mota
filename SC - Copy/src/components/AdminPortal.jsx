import React, { useState } from 'react';
import { runAIScrutinyAudit } from '../services/aiDocEngine';
import { SCHEMES } from '../data/mockApplications';
import { 
  Shield, CheckCircle2, AlertTriangle, Clock, XCircle, Search, Filter, 
  FileText, Sparkles, ExternalLink, Award, UserCheck, MessageSquare, ArrowRight, Eye
} from 'lucide-react';

export default function AdminPortal({ 
  applications, 
  onUpdateStatus, 
  onFlagDeficiency,
  onOpenAwardLetter 
}) {
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || null);
  const [filterScheme, setFilterScheme] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Active Document for Inspection
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  // Deficiency Modal State
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [deficiencyReason, setDeficiencyReason] = useState('');

  // Merit List Generator Modal
  const [showMeritModal, setShowMeritModal] = useState(false);

  // Filtered Applications
  const filteredApps = applications.filter(app => {
    const matchesScheme = filterScheme === 'ALL' || app.schemeId === filterScheme;
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tribeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScheme && matchesStatus && matchesSearch;
  });

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];
  const activeAudit = activeApp ? runAIScrutinyAudit(activeApp, SCHEMES) : null;
  const activeDoc = activeApp?.documents[activeDocIndex] || activeApp?.documents[0];

  // Submit Deficiency Notice
  const handleSendDeficiency = () => {
    if (!deficiencyReason || !activeApp) return;
    onFlagDeficiency(activeApp.id, deficiencyReason);
    setShowDeficiencyModal(false);
    setDeficiencyReason('');
  };

  // Auto-Rank Merit Candidates
  const sortedMeritList = [...applications]
    .filter(a => a.status === 'UNDER_SCRUTINY' || a.status === 'APPROVED' || a.status === 'MERIT_LISTED')
    .sort((a, b) => b.academicPercentage - a.academicPercentage || a.annualIncome - b.annualIncome);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="text-slate-900" size={24} /> MoTA Scrutiny Workdesk & AI Document Intelligence
          </h2>
          <p className="text-xs text-slate-500">Intelligent scrutiny of Scheduled Tribe scholarship & fellowship applications.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMeritModal(true)}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 shadow transition-all flex items-center gap-1.5"
          >
            <Award size={16} /> Merit List Generator
          </button>
          <div className="text-xs font-mono font-bold bg-slate-100 px-3 py-2 rounded-xl text-slate-700 border border-slate-200">
            Total Queue: {applications.length} Apps
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs w-full sm:w-64">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search student, ID, state, tribe..."
            className="bg-transparent outline-none w-full text-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 text-xs font-medium">
          <select
            value={filterScheme}
            onChange={(e) => setFilterScheme(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 outline-none font-bold"
          >
            <option value="ALL">All Schemes (NFST, NOS, Top Class)</option>
            <option value="NFST">NFST (Fellowship India)</option>
            <option value="NOS">NOS (Overseas Scholarship)</option>
            <option value="TOP_CLASS">Top Class Education</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 outline-none font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_SCRUTINY">Under Scrutiny</option>
            <option value="DEFICIENCY_FLAGGED">Deficiency Flagged</option>
            <option value="APPROVED">Approved</option>
            <option value="MERIT_LISTED">Merit Listed</option>
          </select>
        </div>
      </div>

      {/* SPLIT SCRUTINY WORKDESK */}
      {activeApp ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Applications List Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-1">
            <div className="bg-slate-900 text-white p-3.5 text-xs font-bold flex justify-between items-center">
              <span>Applications ({filteredApps.length})</span>
              <span className="text-[11px] text-amber-400">Click to Inspect</span>
            </div>

            <div className="max-h-[680px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setActiveDocIndex(0);
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                    selectedAppId === app.id
                      ? 'bg-amber-500/10 border-2 border-amber-500 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono font-bold text-slate-600">{app.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'MERIT_LISTED' ? 'bg-indigo-100 text-indigo-800' :
                      app.status === 'DEFICIENCY_FLAGGED' ? 'bg-amber-100 text-amber-900' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-1">{app.applicantName}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">{app.tribeName} Tribe • {app.state}</div>

                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-600">
                    <span className="font-semibold">{app.schemeId}</span>
                    <span className="font-bold text-emerald-600">{app.aiVerificationScore}% AI Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Application & Document Inspection Workspace */}
          <div className="lg:col-span-8 space-y-6">
            {/* Applicant Summary Header & Actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-amber-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                      {activeApp.id}
                    </span>
                    <span className="text-xs text-slate-500">{activeApp.schemeName}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{activeApp.applicantName}</h2>
                  <p className="text-xs text-slate-500">{activeApp.tribeName} Scheduled Tribe | District: {activeApp.district}, State: {activeApp.state}</p>
                </div>

                {/* Quick Action Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateStatus(activeApp.id, 'APPROVED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 size={16} /> Approve Scrutiny
                  </button>
                  <button
                    onClick={() => {
                      setDeficiencyReason(activeAudit?.flags[0] || activeApp.deficiencyNotes || "Please upload updated valid document.");
                      setShowDeficiencyModal(true);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1"
                  >
                    <AlertTriangle size={16} /> Flag Deficiency
                  </button>
                  <button
                    onClick={() => onUpdateStatus(activeApp.id, 'REJECTED')}
                    className="px-3 py-2 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 font-bold text-xs rounded-xl transition-all"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>

              {/* AI Verification Badging */}
              {activeAudit && (
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-amber-400">
                      <Sparkles size={16} /> AI Document Intelligence Audit Score
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{activeAudit.overallScore}% Authenticity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeAudit.ruleChecks.map((rc, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg border ${rc.passed ? 'bg-slate-800 border-slate-700' : 'bg-red-950/50 border-red-800 text-red-200'}`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {rc.passed ? <CheckCircle2 className="text-emerald-400" size={14} /> : <AlertTriangle className="text-red-400" size={14} />}
                          <span>{rc.ruleName}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{rc.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Split Inspection Box: Documents & Extracted OCR Data */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Uploaded Document Scrutiny Viewer</span>
                
                {/* Document Tabs */}
                <div className="flex gap-1 overflow-x-auto">
                  {activeApp.documents.map((doc, idx) => (
                    <button
                      key={doc.id}
                      onClick={() => setActiveDocIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeDocIndex === idx
                          ? 'bg-slate-900 text-amber-400 shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {doc.type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Inspector Body */}
              {activeDoc && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Extracted Data & Flags */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-800 uppercase">{activeDoc.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeDoc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {activeDoc.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="font-bold text-slate-700 border-b border-slate-200 pb-1">AI Extracted Metadata</div>
                      {Object.entries(activeDoc.extractedData || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-0.5">
                          <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-semibold text-slate-900">{String(val)}</span>
                        </div>
                      ))}
                    </div>

                    {activeDoc.flags?.length > 0 && (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-amber-800">
                          <AlertTriangle size={14} /> AI Discrepancy Alert
                        </div>
                        {activeDoc.flags.map((f, i) => (
                          <p key={i} className="text-[11px] leading-relaxed">{f}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Simulated Document Preview Paper */}
                  <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-col justify-between min-h-[260px] shadow-inner">
                    <div className="bg-white p-6 rounded border border-slate-300 space-y-4 shadow-sm text-xs font-serif">
                      <div className="text-center font-bold uppercase tracking-widest text-slate-800 border-b pb-2">
                        OFFICIAL GOVERNMENT CERTIFICATE RECORD
                      </div>
                      <div className="space-y-1.5 text-slate-700">
                        <div><strong>Document Type:</strong> {activeDoc.type}</div>
                        <div><strong>Name:</strong> {activeApp.applicantName}</div>
                        <div><strong>Reference No:</strong> {activeDoc.extractedData?.certNo || activeApp.id}</div>
                        <div><strong>Status:</strong> Scrutinized & Stamped digitally by MoTA OCR System.</div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <span className="text-[11px] text-slate-500">Document ID: {activeDoc.id} • Authenticated against Digital Locker API</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <Search size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-600 font-bold">No applications match the selected filter criteria.</p>
        </div>
      )}

      {/* DEFICIENCY MODAL */}
      {showDeficiencyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-600" size={20} /> Issue Deficiency Notice to Candidate
              </h3>
              <button onClick={() => setShowDeficiencyModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-500">Specify the document correction requirement. The candidate will receive an immediate notification in their portal to re-upload.</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deficiency Remarks & Correction Instructions</label>
              <textarea
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                value={deficiencyReason}
                onChange={(e) => setDeficiencyReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeficiencyModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDeficiency}
                className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600"
              >
                Send Deficiency Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MERIT LIST GENERATOR MODAL */}
      {showMeritModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Award className="text-amber-600" size={22} /> Automated MoTA Merit List & Rank Generator
                </h3>
                <p className="text-xs text-slate-500">Auto-ranked based on scheme criteria (Academic Score % & Income Tie-Breaker).</p>
              </div>
              <button onClick={() => setShowMeritModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900 text-amber-400 p-3 rounded-xl text-xs flex justify-between items-center font-mono">
                <span>Total Merit Ranked Candidates: {sortedMeritList.length}</span>
                <span>Committee Approval Desk</span>
              </div>

              <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden text-xs">
                {sortedMeritList.map((app, index) => (
                  <div key={app.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-slate-500 text-[11px]">{app.schemeId} • {app.degree} ({app.institution})</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="font-bold text-slate-900">{app.academicPercentage}% Marks</div>
                        <div className="text-[11px] text-slate-500">Income: ₹{app.annualIncome.toLocaleString('en-IN')}</div>
                      </div>

                      <button
                        onClick={() => {
                          onUpdateStatus(app.id, 'MERIT_LISTED');
                          onOpenAwardLetter(app);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-700"
                      >
                        Issue Sanction
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMeritModal(false)}
                className="px-5 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-xl"
              >
                Close Selection Committee Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
