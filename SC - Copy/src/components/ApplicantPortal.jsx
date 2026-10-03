import React, { useState } from 'react';
import { 
  SCHEMES 
} from '../data/mockApplications';
import { simulateDocumentOCR, runAIScrutinyAudit } from '../services/aiDocEngine';
import { 
  Sparkles, CheckCircle2, AlertTriangle, FileText, Upload, Clock, 
  ChevronRight, Award, Download, ArrowRight, BookOpen, Building, User, DollarSign, Info
} from 'lucide-react';

export default function ApplicantPortal({ 
  applications, 
  activeTab, 
  setActiveTab, 
  onAddNewApplication, 
  onResubmitDeficiency,
  onOpenAwardLetter 
}) {
  // Application Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    schemeId: "NFST",
    applicantName: "Birsa Munda",
    gender: "Male",
    tribeName: "Santhal",
    state: "Jharkhand",
    district: "Ranchi",
    annualIncome: 350000,
    academicPercentage: 79.5,
    degree: "Ph.D. in Tribal Development Studies",
    institution: "Central University of Jharkhand",
    researchTopic: "Socio-Economic Impact of Forest Rights Act on Tribal Communities",
    aadhaarNo: "4819-2041-9921",
    bankAccountNo: "918234710293",
    bankIfsc: "SBIN0001824",
    bankName: "State Bank of India - Main Branch Ranchi",
    country: "India"
  });

  // Simulated uploaded files with instant AI verification status
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: "upl-1",
      docType: "Caste Certificate",
      fileName: "ST_Caste_Certificate_Santhal.pdf",
      aiStatus: "VERIFIED",
      extracted: { certNo: "JH/ST/2024/99120", tribe: "Santhal", issuingOfficer: "SDO Ranchi" }
    },
    {
      id: "upl-2",
      docType: "Income Certificate",
      fileName: "Income_Cert_3.5L.pdf",
      aiStatus: "VERIFIED",
      extracted: { incomeAmount: 350000, validUntil: "2027-03-31" }
    }
  ]);

  const [aiPreCheckResult, setAiPreCheckResult] = useState(null);
  const [uploadingDocType, setUploadingDocType] = useState("");
  const [resubmittingDocId, setResubmittingDocId] = useState(null);
  const [resubmitFileName, setResubmitFileName] = useState("");

  const selectedScheme = SCHEMES.find(s => s.id === formData.schemeId) || SCHEMES[0];

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'annualIncome' || name === 'academicPercentage' ? Number(value) : value
    }));
  };

  // Handle Document Upload Simulation
  const handleFileUpload = (docType, fileName) => {
    const ocrData = simulateDocumentOCR(fileName || `${docType}_Document.pdf`, docType);
    const newFile = {
      id: "upl-" + Date.now(),
      docType,
      fileName: fileName || `${docType}_Document.pdf`,
      aiStatus: ocrData.verificationStatus === "DEFICIENT" ? "DEFICIENT" : "VERIFIED",
      extracted: ocrData
    };
    
    setUploadedFiles(prev => [...prev.filter(f => f.docType !== docType), newFile]);
  };

  // Run AI Pre-screening before submit
  const handleRunAIPreCheck = () => {
    const mockApp = {
      ...formData,
      schemeName: selectedScheme.name,
      documents: uploadedFiles.map(f => ({
        id: f.id,
        name: f.fileName,
        type: f.docType,
        extractedData: f.extracted,
        status: f.aiStatus
      }))
    };
    const result = runAIScrutinyAudit(mockApp, SCHEMES);
    setAiPreCheckResult(result);
  };

  // Handle Submit Application
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const newApp = {
      id: `MOTA-2026-${formData.schemeId}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      schemeName: selectedScheme.name,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "UNDER_SCRUTINY",
      aiVerificationScore: aiPreCheckResult ? aiPreCheckResult.overallScore : 95,
      documents: uploadedFiles.map(f => ({
        id: f.id,
        name: f.fileName,
        type: f.docType,
        extractedData: f.extracted,
        status: "VERIFIED",
        flags: []
      })),
      timeline: [
        { date: new Date().toLocaleString(), title: "Application Submitted by Candidate", by: formData.applicantName, status: "completed" },
        { date: new Date().toLocaleString(), title: "Automated AI Document Verification Passed", by: "AI Intelligence Engine", status: "completed" },
        { date: new Date().toLocaleString(), title: "Queued for Scrutiny by MoTA Nodal Desk", by: "Ministry System", status: "current" }
      ],
      deficiencyNotes: "",
      bankDetails: {
        accountNo: formData.bankAccountNo,
        ifsc: formData.bankIfsc,
        bankName: formData.bankName
      }
    };

    onAddNewApplication(newApp);
    setActiveTab('my_applications');
  };

  // Handle Resubmit Deficiency Document
  const handleResubmitDoc = (appId, docId) => {
    if (!resubmitFileName) return;
    const ocrData = simulateDocumentOCR(resubmitFileName, "Unconditional Admission Letter");
    onResubmitDeficiency(appId, docId, resubmitFileName, ocrData);
    setResubmittingDocId(null);
    setResubmitFileName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* MY APPLICATIONS TAB */}
      {activeTab === 'my_applications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">My Scheme Applications</h2>
              <p className="text-sm text-slate-500">Track application status, respond to scrutiny deficiencies, and download award certificates.</p>
            </div>
            <button
              onClick={() => setActiveTab('apply_new')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles size={18} /> Apply for New Scheme
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Active Applications Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">You haven't submitted any scholarship or fellowship applications yet.</p>
              <button
                onClick={() => setActiveTab('apply_new')}
                className="px-5 py-2.5 bg-slate-900 text-amber-400 font-bold rounded-xl"
              >
                Explore & Apply Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  {/* Application Banner */}
                  <div className="bg-slate-900 text-white p-5 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/20 text-amber-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
                          {app.id}
                        </span>
                        <span className="text-xs text-slate-400">Applied on {app.appliedDate}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{app.schemeName}</h3>
                      <p className="text-xs text-slate-300">Degree: {app.degree} | Institute: {app.institution}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        app.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        app.status === 'MERIT_LISTED' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                        app.status === 'DEFICIENT' || app.status === 'DEFICIENCY_FLAGGED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse-slow' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {app.status === 'APPROVED' && <CheckCircle2 size={14} />}
                        {app.status === 'MERIT_LISTED' && <Award size={14} />}
                        {(app.status === 'DEFICIENT' || app.status === 'DEFICIENCY_FLAGGED') && <AlertTriangle size={14} />}
                        {app.status === 'UNDER_SCRUTINY' && <Clock size={14} />}
                        {app.status.replace('_', ' ')}
                      </span>

                      {(app.status === 'APPROVED' || app.status === 'MERIT_LISTED') && (
                        <button
                          onClick={() => onOpenAwardLetter(app)}
                          className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                        >
                          <Download size={14} /> Award Letter
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Details Column */}
                    <div className="space-y-3 lg:border-r border-slate-100 lg:pr-6">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Applicant & Income Profile</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Applicant:</span>
                          <span className="font-semibold text-slate-900">{app.applicantName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Tribe / Community:</span>
                          <span className="font-semibold text-slate-900">{app.tribeName} ({app.state})</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Annual Family Income:</span>
                          <span className="font-semibold text-slate-900">₹{app.annualIncome.toLocaleString('en-IN')} / year</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Academic Score:</span>
                          <span className="font-semibold text-slate-900">{app.academicPercentage}% Marks</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">AI Verification Confidence:</span>
                          <span className="font-bold text-emerald-600">{app.aiVerificationScore}% Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Column */}
                    <div className="space-y-3 lg:border-r border-slate-100 lg:pr-6">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Scrutiny Progress Lifecycle</h4>
                      <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
                        {app.timeline?.map((item, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                              item.status === 'completed' ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'
                            }`} />
                            <div className="text-xs font-bold text-slate-800">{item.title}</div>
                            <div className="text-[11px] text-slate-400">{item.date} • {item.by}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deficiency Alert & Resubmission Box */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Actions & Communication</h4>
                      
                      {(app.status === 'DEFICIENT' || app.status === 'DEFICIENCY_FLAGGED') ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                            <div>
                              <h5 className="text-xs font-bold text-amber-900">Scrutiny Deficiency Flagged</h5>
                              <p className="text-xs text-amber-800 mt-1 leading-relaxed">{app.deficiencyNotes || "Specific document requirements were flagged by the scrutiny officer."}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-amber-200/60 space-y-2">
                            <span className="text-[11px] font-bold text-slate-700">Flagged Document:</span>
                            {app.documents.filter(d => d.status === 'DEFICIENT' || d.status === 'WARNING').map(d => (
                              <div key={d.id} className="bg-white p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-800">{d.name}</span>
                                {resubmittingDocId === d.id ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="New_Doc_Filename.pdf"
                                      className="px-2 py-1 text-xs border border-slate-300 rounded"
                                      value={resubmitFileName}
                                      onChange={(e) => setResubmitFileName(e.target.value)}
                                    />
                                    <button
                                      onClick={() => handleResubmitDoc(app.id, d.id)}
                                      className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded hover:bg-amber-600"
                                    >
                                      Re-Upload
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setResubmittingDocId(d.id);
                                      setResubmitFileName("Unconditional_Offer_Letter_Edinburgh.pdf");
                                    }}
                                    className="px-2.5 py-1 bg-slate-900 text-amber-400 font-bold text-xs rounded hover:bg-slate-800"
                                  >
                                    Resolve
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                          <CheckCircle2 className="mx-auto text-emerald-500 mb-1" size={24} />
                          <h5 className="text-xs font-bold text-slate-800">Application Verified</h5>
                          <p className="text-xs text-slate-500 mt-1">No action required from applicant at this time.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NEW APPLICATION WIZARD TAB */}
      {activeTab === 'apply_new' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">MoTA Scholarship & Fellowship Online Application</h2>
            <p className="text-xs text-slate-500 mt-1">Complete your digital application form. All uploaded documents will be pre-scrutinized instantly by the AI Document Engine.</p>

            {/* Stepper Header */}
            <div className="flex items-center justify-between my-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
              {[
                { step: 1, label: "Scheme Select" },
                { step: 2, label: "Personal & Tribal" },
                { step: 3, label: "Academic Details" },
                { step: 4, label: "AI Doc Scrutiny" }
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center bg-white px-2 z-10">
                  <div className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                    currentStep === s.step
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-4 ring-amber-100'
                      : currentStep > s.step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentStep > s.step ? <CheckCircle2 size={18} /> : s.step}
                  </div>
                  <span className="text-xs font-medium text-slate-600 mt-1">{s.label}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* STEP 1: SCHEME SELECT */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Select Ministry Scheme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SCHEMES.map((scheme) => (
                      <div
                        key={scheme.id}
                        onClick={() => setFormData(p => ({ ...p, schemeId: scheme.id }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.schemeId === scheme.id
                            ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                            {scheme.id}
                          </span>
                          {formData.schemeId === scheme.id && <CheckCircle2 size={18} className="text-amber-600" />}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-2">{scheme.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{scheme.description}</p>
                        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                          <div>Max Income: <strong className="text-slate-900">₹{(scheme.maxIncome/100000).toFixed(1)} Lakhs</strong></div>
                          <div>Min Marks: <strong className="text-slate-900">{scheme.minPercentage}%</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-600 flex items-center gap-2"
                    >
                      Next: Personal Profile <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL & TRIBAL DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Applicant & ST Certificate Profile</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Candidate Name (as per Aadhaar)</label>
                      <input
                        type="text"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Tribe (ST) / Community</label>
                      <input
                        type="text"
                        name="tribeName"
                        value={formData.tribeName}
                        onChange={handleChange}
                        placeholder="e.g. Santhal, Oraon, Gond, Bodo, Mina"
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Native State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Annual Family Income (₹ per annum)</label>
                      <input
                        type="number"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Number</label>
                      <input
                        type="text"
                        name="aadhaarNo"
                        value={formData.aadhaarNo}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-600"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-600 flex items-center gap-2"
                    >
                      Next: Academic Qualification <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ACADEMIC & RESEARCH */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Higher Education & Admission Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Programme</label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Aggregate Marks / CGPA Percentage (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="academicPercentage"
                        value={formData.academicPercentage}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Enrolled Institution / Foreign University</label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Research Topic / Course Specialization</label>
                      <input
                        type="text"
                        name="researchTopic"
                        value={formData.researchTopic}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-600"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleRunAIPreCheck();
                        setCurrentStep(4);
                      }}
                      className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-600 flex items-center gap-2"
                    >
                      Next: Upload & AI Scrutiny <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENT UPLOAD & INSTANT AI SCRUTINY */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Document Intelligence & AI Pre-Screening</h3>
                    <p className="text-xs text-slate-500 mt-1">Upload required certificates. The system will run real-time OCR extraction and rule validation.</p>
                  </div>

                  {/* Required Documents Upload Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedScheme.docsRequired.map((docType, idx) => {
                      const uploaded = uploadedFiles.find(f => f.docType === docType);
                      return (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">{docType}</span>
                            {uploaded ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 size={12} /> Extracted & Verified
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded">Required</span>
                            )}
                          </div>

                          {uploaded ? (
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                              <div className="font-semibold text-slate-900 truncate">{uploaded.fileName}</div>
                              <div className="text-[11px] text-slate-500">Extracted: {JSON.stringify(uploaded.extracted.certNo || uploaded.extracted.incomeAmount || uploaded.extracted.docType)}</div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFileUpload(docType, `${docType.replace(/\s+/g, '_')}_Birsa.pdf`)}
                              className="w-full py-2 bg-white border border-dashed border-slate-300 hover:border-amber-500 rounded-lg text-xs font-semibold text-slate-600 hover:text-amber-600 flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Upload size={14} /> Upload {docType} (PDF)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Pre-Screening Audit Report Widget */}
                  {aiPreCheckResult && (
                    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Sparkles size={20} className="text-amber-400" />
                          <h4 className="font-bold text-sm">Real-time AI Pre-Scrutiny Audit Report</h4>
                        </div>
                        <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                          {aiPreCheckResult.overallScore}% Eligibility Score
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {aiPreCheckResult.ruleChecks.map((rc, idx) => (
                          <div key={idx} className={`p-3 rounded-xl border ${rc.passed ? 'bg-slate-800/80 border-slate-700' : 'bg-red-950/40 border-red-800'}`}>
                            <div className="flex items-center gap-2 font-bold">
                              {rc.passed ? <CheckCircle2 className="text-emerald-400" size={14} /> : <AlertTriangle className="text-red-400" size={14} />}
                              <span>{rc.ruleName}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1">{rc.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-600"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      Submit Application to MoTA <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* SCHEME GUIDELINES TAB */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">MoTA Scholarship & Fellowship Schemes</h2>
            <p className="text-sm text-slate-500">Official guidelines, income limits, and eligibility criteria configured under Ministry of Tribal Affairs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCHEMES.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-900 text-amber-400 text-xs font-mono font-bold px-3 py-1 rounded-full">
                      {scheme.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{scheme.slots} Annual Slots</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{scheme.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{scheme.description}</p>
                  
                  <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-semibold text-slate-900">{scheme.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income Limit:</span>
                      <span className="font-semibold text-slate-900">≤ ₹{(scheme.maxIncome/100000).toFixed(1)} Lakhs/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min. Qualification:</span>
                      <span className="font-semibold text-slate-900">{scheme.minPercentage}% Marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fellowship Rate:</span>
                      <span className="font-semibold text-amber-700">{scheme.stipendAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      setFormData(p => ({ ...p, schemeId: scheme.id }));
                      setActiveTab('apply_new');
                      setCurrentStep(1);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow transition-all"
                  >
                    Apply for {scheme.id}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
