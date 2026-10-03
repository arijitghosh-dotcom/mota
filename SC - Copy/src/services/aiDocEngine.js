/**
 * MoTA AI Document Intelligence & Rule Engine
 * Automated OCR Extraction, Consistency Verification, and Rule Validation
 */

import { SCHEMES } from '../data/mockApplications';

// Calculate Levenshtein distance for string similarity matching
function calculateSimilarity(str1 = "", str2 = "") {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;
  
  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

/**
 * Simulate OCR extraction from uploaded document
 */
export function simulateDocumentOCR(fileName, fileType) {
  const cleanName = fileName.toLowerCase();
  
  if (cleanName.includes("caste") || fileType === "Caste Certificate") {
    return {
      docType: "Caste Certificate",
      certNo: "ST/" + Math.floor(10000 + Math.random() * 90000),
      tribe: "Santhal",
      issuingAuthority: "Sub-Divisional Officer (SDO)",
      verificationStatus: "AUTHENTICATED_GOVT_REPOSITORY",
      confidence: 99.2
    };
  } else if (cleanName.includes("income") || fileType === "Income Certificate") {
    const randomIncome = 250000 + Math.floor(Math.random() * 500000);
    return {
      docType: "Income Certificate",
      incomeAmount: randomIncome,
      validityPeriod: "Financial Year 2025-26",
      issuingAuthority: "Revenue Department / Tehsildar",
      verificationStatus: "VALID",
      confidence: 97.5
    };
  } else if (cleanName.includes("marksheet") || fileType === "Academic Marksheet") {
    return {
      docType: "Academic Marksheet",
      aggregateMarks: "79.4%",
      degree: "Post Graduation / Master's",
      university: "Central University of Jharkhand",
      verificationStatus: "VERIFIED",
      confidence: 98.1
    };
  } else if (cleanName.includes("offer") || cleanName.includes("admission") || fileType === "Admission Letter") {
    const isConditional = cleanName.includes("conditional");
    return {
      docType: "Admission Offer Letter",
      offerType: isConditional ? "CONDITIONAL" : "UNCONDITIONAL",
      institution: "Imperial College London, UK",
      course: "M.Sc. Advanced Computing",
      verificationStatus: isConditional ? "FLAGGED_CONDITIONAL" : "VERIFIED",
      confidence: 95.8
    };
  }

  return {
    docType: "General Identity/Academic Record",
    extractedText: "Doc ID: " + Math.random().toString(36).substring(7).toUpperCase(),
    verificationStatus: "PENDING_SCRUTINY",
    confidence: 92.0
  };
}

/**
 * Run Comprehensive Rule Engine & AI Scrutiny Audit on Application
 */
export function runAIScrutinyAudit(application, schemeList = SCHEMES) {
  const scheme = schemeList.find(s => s.id === application.schemeId) || SCHEMES[0];
  const auditResults = {
    overallScore: 100,
    flags: [],
    warnings: [],
    ruleChecks: [],
    nameMatchingScore: 98,
    isEligible: true,
    suggestedStatus: "UNDER_SCRUTINY"
  };

  // Rule 1: Income Ceiling Validation
  const maxIncome = scheme.maxIncome || 600000;
  const incomePass = application.annualIncome <= maxIncome;
  auditResults.ruleChecks.push({
    ruleName: `Income Ceiling Check (Max ₹${(maxIncome/100000).toFixed(1)} Lakhs)`,
    passed: incomePass,
    details: incomePass 
      ? `Annual income ₹${application.annualIncome.toLocaleString('en-IN')} is within ₹${maxIncome.toLocaleString('en-IN')} limit.`
      : `EXCEEDS LIMIT: Income ₹${application.annualIncome.toLocaleString('en-IN')} exceeds ceiling of ₹${maxIncome.toLocaleString('en-IN')}.`
  });

  if (!incomePass) {
    auditResults.overallScore -= 35;
    auditResults.flags.push(`Income ₹${application.annualIncome.toLocaleString('en-IN')} exceeds ${scheme.id} upper limit ₹${maxIncome.toLocaleString('en-IN')}.`);
    auditResults.isEligible = false;
  } else if (application.annualIncome > maxIncome * 0.9) {
    auditResults.warnings.push(`Income ₹${application.annualIncome.toLocaleString('en-IN')} is within 10% of upper limit ₹${maxIncome.toLocaleString('en-IN')}. Extra verification advised.`);
    auditResults.overallScore -= 5;
  }

  // Rule 2: Minimum Academic Marks %
  const minPercentage = scheme.minPercentage || 55;
  const marksPass = application.academicPercentage >= minPercentage;
  auditResults.ruleChecks.push({
    ruleName: `Minimum Qualification Marks (≥ ${minPercentage}%)`,
    passed: marksPass,
    details: marksPass
      ? `Academic marks ${application.academicPercentage}% satisfies minimum criterion of ${minPercentage}%.`
      : `BELOW THRESHOLD: Applicant has ${application.academicPercentage}%, required is ${minPercentage}%.`
  });

  if (!marksPass) {
    auditResults.overallScore -= 30;
    auditResults.flags.push(`Academic score of ${application.academicPercentage}% is below minimum required ${minPercentage}%.`);
    auditResults.isEligible = false;
  }

  // Rule 3: Scheme Specific Rules (e.g. NOS Unconditional Offer Letter Check)
  if (scheme.id === "NOS") {
    const offerDoc = application.documents.find(d => d.type === "Admission Letter" || d.name.toLowerCase().includes("offer"));
    if (offerDoc && (offerDoc.extractedData?.condition || offerDoc.extractedData?.offerType === "CONDITIONAL" || offerDoc.status === "DEFICIENT")) {
      auditResults.overallScore -= 25;
      auditResults.flags.push("NOS requires an UNCONDITIONAL Admission Offer Letter. Provided offer contains pending conditions.");
      auditResults.suggestedStatus = "DEFICIENCY_FLAGGED";
    }
  }

  // Rule 4: Mandatory Document Audit
  const uploadedDocTypes = application.documents.map(d => d.type);
  const missingDocs = [];
  if (!uploadedDocTypes.includes("Caste Certificate")) missingDocs.push("ST Caste Certificate");
  if (!uploadedDocTypes.includes("Income Certificate")) missingDocs.push("Income Certificate");

  if (missingDocs.length > 0) {
    auditResults.overallScore -= 20 * missingDocs.length;
    auditResults.flags.push(`Missing Mandatory Documents: ${missingDocs.join(", ")}`);
    auditResults.suggestedStatus = "DEFICIENCY_FLAGGED";
  }

  // Determine final score bounds
  auditResults.overallScore = Math.max(0, Math.min(100, auditResults.overallScore));

  if (auditResults.flags.length === 0 && auditResults.overallScore >= 90) {
    auditResults.suggestedStatus = "RECOMMENDED_FOR_APPROVAL";
  }

  return auditResults;
}
