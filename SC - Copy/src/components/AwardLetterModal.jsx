import React from 'react';
import { Award, Download, Printer, Shield, CheckCircle2 } from 'lucide-react';

export default function AwardLetterModal({ application, onClose }) {
  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto print:p-0 print:shadow-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg print:hidden"
        >
          ✕
        </button>

        {/* Certificate Border Header */}
        <div className="border-4 border-double border-amber-600 p-6 rounded-xl space-y-6 text-center bg-amber-50/20 relative">
          
          {/* Govt Emblem */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-white to-emerald-600 flex items-center justify-center text-xl shadow">
              🏛️
            </div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-widest mt-1">Ministry of Tribal Affairs</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Government of India, New Delhi</div>
            <div className="w-24 h-0.5 bg-amber-500 my-2" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">OFFICIAL FELLOWSHIP SELECTION SANCTION LETTER</h2>
            <p className="text-xs font-mono font-bold text-amber-700">SANCTION REF NO: MoTA/ST/{application.schemeId}/2026/{application.id}</p>
          </div>

          <div className="text-left text-xs leading-relaxed text-slate-800 space-y-3 pt-2">
            <p>To,</p>
            <p className="font-bold text-sm text-slate-900">{application.applicantName}</p>
            <p className="text-slate-600">S/D of Tribal Community: <strong>{application.tribeName}</strong> | Native State: <strong>{application.state}</strong></p>

            <p className="pt-2">
              With reference to your application no. <strong>{application.id}</strong> submitted for the <strong>{application.schemeName}</strong>, the Ministry of Tribal Affairs, Government of India is pleased to inform you that you have been <strong>SELECTED AND SHORTLISTED IN THE NATIONAL MERIT LIST</strong> for the academic session 2026.
            </p>

            <div className="bg-white p-4 rounded-xl border border-amber-300 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-amber-100">
                <span className="text-slate-500">Degree / Course:</span>
                <span className="font-bold text-slate-900">{application.degree}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-100">
                <span className="text-slate-500">Enrolled Institution:</span>
                <span className="font-bold text-slate-900">{application.institution}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Direct Financial Benefit Transfer (DBT) Bank:</span>
                <span className="font-bold text-slate-900">{application.bankDetails?.bankName} (A/c: {application.bankDetails?.accountNo})</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Note: Fellowship funds will be disbursed directly into your Aadhaar-linked bank account subject to quarterly academic progress reporting verified by institution head.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 flex justify-between items-end text-xs text-left">
            <div>
              <div className="w-16 h-16 border border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 bg-white">
                [ QR CODE VERIFIED ]
              </div>
              <div className="text-[9px] text-slate-400 mt-1">Digitally Authenticated</div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-bold text-slate-900">Dr. R. K. Meena, IAS</div>
              <div className="text-[11px] text-slate-600">Joint Secretary to Govt. of India</div>
              <div className="text-[10px] text-amber-700 font-bold">Ministry of Tribal Affairs</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Printer size={16} /> Print Letter
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
