import React from 'react';
import { UserCheck, Shield, Sparkles, LayoutDashboard, Sliders, FileText, Bell, Search } from 'lucide-react';

export default function Header({ role, setRole, activeTab, setActiveTab, pendingDeficienciesCount }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Govt Emblem & Branding Bar */}
      <div className="bg-[#0A2540] text-white px-4 py-2 flex flex-wrap justify-between items-center text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-white to-emerald-600 flex items-center justify-center text-[10px] font-bold text-slate-900 border border-amber-300 shadow">
            🏛️
          </div>
          <div>
            <span className="font-bold tracking-wide uppercase text-amber-300">Ministry of Tribal Affairs</span>
            <span className="mx-2 text-slate-400">|</span>
            <span className="text-slate-200">Government of India</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-slate-300">
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-500/30 flex items-center gap-1">
            <Sparkles size={12} /> AI-Powered Digital Governance Portal
          </span>
          <span className="hidden sm:inline text-slate-400">Toll-Free Helpline: 1800-11-7788</span>
        </div>
      </div>

      {/* Main Navigation & Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 rounded-xl text-amber-400 shadow-md">
            <Shield size={26} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              MoTA Scholarship & Fellowship Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              National Fellowship (NFST) & Overseas Scholarship (NOS) System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          {role === 'applicant' ? (
            <>
              <button
                onClick={() => setActiveTab('my_applications')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'my_applications'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText size={16} /> My Applications
              </button>
              <button
                onClick={() => setActiveTab('apply_new')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'apply_new'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles size={16} /> New Application Form
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'schemes'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Search size={16} /> Scheme Guidelines
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('scrutiny_workdesk')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'scrutiny_workdesk'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserCheck size={16} /> Scrutiny Workdesk
                {pendingDeficienciesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
                    {pendingDeficienciesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'analytics'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard size={16} /> Analytics & Reports
              </button>
              <button
                onClick={() => setActiveTab('configurator')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'configurator'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sliders size={16} /> Scheme Rules Config
              </button>
            </>
          )}
        </nav>

        {/* Role Toggle Switch */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => {
              setRole('applicant');
              setActiveTab('my_applications');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              role === 'applicant'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>👨‍🎓</span> Applicant Portal
          </button>
          <button
            onClick={() => {
              setRole('admin');
              setActiveTab('scrutiny_workdesk');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              role === 'admin'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🏛️</span> MoTA Scrutiny Desk
          </button>
        </div>
      </div>
    </header>
  );
}
