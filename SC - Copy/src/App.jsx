import React, { useState } from 'react';
import Header from './components/Header';
import ApplicantPortal from './components/ApplicantPortal';
import AdminPortal from './components/AdminPortal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SchemeConfigurator from './components/SchemeConfigurator';
import AwardLetterModal from './components/AwardLetterModal';
import { INITIAL_APPLICATIONS } from './data/mockApplications';

export default function App() {
  const [role, setRole] = useState('applicant'); // 'applicant' | 'admin'
  const [activeTab, setActiveTab] = useState('my_applications');
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedAwardApp, setSelectedAwardApp] = useState(null);

  // Add New Application
  const handleAddNewApplication = (newApp) => {
    setApplications(prev => [newApp, ...prev]);
  };

  // Update Application Status (Approve / Merit / Reject)
  const handleUpdateStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const titleMap = {
          'APPROVED': 'Application Scrutiny Approved',
          'MERIT_LISTED': 'Shortlisted in National Merit List & Sanctioned',
          'REJECTED': 'Application Rejected by Scrutiny Desk',
          'UNDER_SCRUTINY': 'Re-queued for Scrutiny'
        };
        return {
          ...app,
          status: newStatus,
          timeline: [
            ...app.timeline,
            {
              date: new Date().toLocaleString(),
              title: titleMap[newStatus] || 'Status Updated',
              by: role === 'admin' ? 'MoTA Scrutiny Officer' : 'System',
              status: 'completed'
            }
          ]
        };
      }
      return app;
    }));
  };

  // Flag Deficiency
  const handleFlagDeficiency = (appId, deficiencyNotes) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'DEFICIENCY_FLAGGED',
          deficiencyNotes,
          documents: app.documents.map(d => ({
            ...d,
            status: d.flags?.length > 0 ? 'DEFICIENT' : d.status
          })),
          timeline: [
            ...app.timeline,
            {
              date: new Date().toLocaleString(),
              title: 'Deficiency Notice Flagged by MoTA Desk',
              by: 'MoTA Scrutiny Desk',
              status: 'current'
            }
          ]
        };
      }
      return app;
    }));
  };

  // Resubmit Deficiency Document
  const handleResubmitDeficiency = (appId, docId, newFileName, ocrData) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'UNDER_SCRUTINY',
          deficiencyNotes: '',
          documents: app.documents.map(d => {
            if (d.id === docId) {
              return {
                ...d,
                name: newFileName,
                status: 'VERIFIED',
                flags: [],
                extractedData: ocrData
              };
            }
            return d;
          }),
          timeline: [
            ...app.timeline,
            {
              date: new Date().toLocaleString(),
              title: 'Deficient Document Resubmitted by Applicant',
              by: app.applicantName,
              status: 'completed'
            },
            {
              date: new Date().toLocaleString(),
              title: 'AI Re-Verification Passed - Under Final Scrutiny',
              by: 'AI Engine',
              status: 'current'
            }
          ]
        };
      }
      return app;
    }));
  };

  const pendingDeficienciesCount = applications.filter(a => a.status === 'DEFICIENCY_FLAGGED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Inter',sans-serif]">
      {/* Navigation Header */}
      <Header
        role={role}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingDeficienciesCount={pendingDeficienciesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {role === 'applicant' ? (
          <ApplicantPortal
            applications={applications}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddNewApplication={handleAddNewApplication}
            onResubmitDeficiency={handleResubmitDeficiency}
            onOpenAwardLetter={(app) => setSelectedAwardApp(app)}
          />
        ) : (
          <>
            {activeTab === 'scrutiny_workdesk' && (
              <AdminPortal
                applications={applications}
                onUpdateStatus={handleUpdateStatus}
                onFlagDeficiency={handleFlagDeficiency}
                onOpenAwardLetter={(app) => setSelectedAwardApp(app)}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard applications={applications} />
            )}
            {activeTab === 'configurator' && (
              <SchemeConfigurator />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="font-bold text-amber-400">Ministry of Tribal Affairs (MoTA)</span> | Government of India
            <div className="text-[11px] text-slate-500 mt-0.5">Designed for Scheduled Tribe (ST) National Fellowship (NFST) & Overseas Scholarship (NOS) Schemes</div>
          </div>
          <div className="text-slate-500 text-[11px]">
            Security Compliant • Digital India Initiative • ST Welfare Division
          </div>
        </div>
      </footer>

      {/* Award Letter Modal */}
      {selectedAwardApp && (
        <AwardLetterModal
          application={selectedAwardApp}
          onClose={() => setSelectedAwardApp(null)}
        />
      )}
    </div>
  );
}
