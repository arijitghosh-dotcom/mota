import React, { useState } from 'react';
import { SCHEMES } from '../data/mockApplications';
import { Sliders, Save, Plus, CheckCircle2, DollarSign, Award, BookOpen, Trash2 } from 'lucide-react';

export default function SchemeConfigurator() {
  const [schemeConfigs, setSchemeConfigs] = useState(SCHEMES);
  const [selectedSchemeId, setSelectedSchemeId] = useState(SCHEMES[0].id);
  const [saveNotification, setSaveNotification] = useState(false);

  const activeScheme = schemeConfigs.find(s => s.id === selectedSchemeId) || schemeConfigs[0];

  const handleUpdateActiveScheme = (field, value) => {
    setSchemeConfigs(prev => prev.map(s => {
      if (s.id === selectedSchemeId) {
        return {
          ...s,
          [field]: field === 'maxIncome' || field === 'minPercentage' || field === 'slots' ? Number(value) : value
        };
      }
      return s;
    }));
  };

  const handleSaveConfig = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="text-slate-900" size={24} /> MoTA Scheme Rules Configurator Engine
          </h2>
          <p className="text-xs text-slate-500">Configure scheme-specific income limits, academic thresholds, slot quotas, and required documents dynamically.</p>
        </div>

        {saveNotification && (
          <div className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow animate-bounce">
            <CheckCircle2 size={16} /> Scheme Rules Saved & Live in Rule Engine!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheme Selection Sidebar */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select Scheme to Configure</h3>
          <div className="space-y-2">
            {schemeConfigs.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setSelectedSchemeId(scheme.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSchemeId === scheme.id
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                    {scheme.id}
                  </span>
                  <span className="text-xs text-slate-500">{scheme.slots} Slots</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-2">{scheme.name}</h4>
                <div className="text-xs text-slate-500 mt-1">Income Cap: ₹{(scheme.maxIncome/100000).toFixed(1)}L | Min Marks: {scheme.minPercentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="bg-slate-900 text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded">
                {activeScheme.id} CONFIGURATION
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{activeScheme.name}</h3>
            </div>
            <button
              onClick={handleSaveConfig}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Save size={16} /> Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Family Income Limit (₹ / annum)</label>
              <input
                type="number"
                step="50000"
                value={activeScheme.maxIncome}
                onChange={(e) => handleUpdateActiveScheme('maxIncome', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Qualification Score (%)</label>
              <input
                type="number"
                step="1"
                value={activeScheme.minPercentage}
                onChange={(e) => handleUpdateActiveScheme('minPercentage', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Allocated Annual Quota Slots</label>
              <input
                type="number"
                value={activeScheme.slots}
                onChange={(e) => handleUpdateActiveScheme('slots', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stipend Rate / Financial Benefit Text</label>
              <input
                type="text"
                value={activeScheme.stipendAmount}
                onChange={(e) => handleUpdateActiveScheme('stipendAmount', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase">Mandatory Verification Documents</h4>
            <div className="flex flex-wrap gap-2">
              {activeScheme.docsRequired.map((doc, idx) => (
                <span key={idx} className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span>📄 {doc}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
