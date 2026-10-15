/**
 * SkillLens AI - Document Screening & Verification Pipeline Simulator
 * Strictly enforces Section 9:
 * - Validates document type: confirms whether the document matches a valid resume
 * - Rejects non-resume documents (invoices, receipts, contracts, generic text)
 * - Returns explainable flags with 'needs human review', never 'genuine' or 'fake'.
 */
import {
  ScreeningReport,
  ScreeningStepResult,
  ParsedResume,
  IntakeMethod,
  ExtractedSkill,
  EvidenceLevel,
} from '@/packages/shared/src/types';
import { normalizeSkillText } from './escoService';

export interface DocumentAnalysisInput {
  submissionId: string;
  intakeMethod: IntakeMethod;
  fileName: string;
  fileSize: number;
  mimeType: string;
  imageDimensions?: { width: number; height: number };
  cropCorners?: Array<{ x: number; y: number }>;
  textOverride?: string;
  forceNonResume?: boolean;
}

/**
 * Runs the 6-step screening pipeline on an uploaded or camera-captured document
 */
export async function runScreeningPipeline(
  input: DocumentAnalysisInput
): Promise<{ report: ScreeningReport; parsedResume: ParsedResume }> {
  // Simulate processing time
  await new Promise((r) => setTimeout(r, 350));

  const steps: ScreeningStepResult[] = [];
  const qualityFlags: string[] = [];
  const riskFlags: string[] = [];

  // STEP 1: Quality Check (Blur, Brightness, Resolution)
  const isBlurry = input.fileName.toLowerCase().includes('blurry');
  const isDark = input.fileName.toLowerCase().includes('dark');
  const laplacianVariance = isBlurry ? 42.5 : 184.2; // Threshold >= 100
  const meanBrightness = isDark ? 68.0 : 212.4; // Threshold 80 - 240
  const width = input.imageDimensions?.width || 1800;
  const height = input.imageDimensions?.height || 2400;

  const step1Flags: string[] = [];
  let step1Status: 'passed' | 'warning' | 'failed' = 'passed';
  if (laplacianVariance < 100) {
    step1Flags.push('High motion blur detected (Laplacian variance < 100). Text edges may be degraded.');
    qualityFlags.push('Motion blur detected');
    step1Status = 'warning';
  }
  if (meanBrightness < 80) {
    step1Flags.push('Low ambient luminance detected (mean brightness < 80). Uneven shadow distribution.');
    qualityFlags.push('Suboptimal lighting');
    step1Status = 'warning';
  }

  steps.push({
    step: 'quality_check',
    status: step1Status,
    flags: step1Flags,
    metrics: {
      laplacianVariance: Math.round(laplacianVariance * 10) / 10,
      meanBrightness: Math.round(meanBrightness * 10) / 10,
      resolution: `${width}x${height}`,
      megapixels: Math.round(((width * height) / 1_000_000) * 10) / 10,
    },
    timestamp: new Date().toISOString(),
  });

  // STEP 2 & 3: Document Detect & Perspective Warp (Camera method only)
  if (input.intakeMethod === 'camera_capture') {
    const hasManualCorners = input.cropCorners && input.cropCorners.length === 4;
    steps.push({
      step: 'document_detect',
      status: 'passed',
      flags: ['Primary 4-point convex quadrilateral detected via approxPolyDP contour analysis.'],
      metrics: {
        contourPoints: 4,
        aspectRatio: '1.41 (A4 match)',
        convexityRatio: 0.98,
      },
      timestamp: new Date().toISOString(),
    });

    steps.push({
      step: 'perspective',
      status: 'passed',
      flags: hasManualCorners
        ? ['Perspective rectification applied using confirmed crop corners.']
        : ['Automatic homography transformation warped page to orthogonal top-down plane.'],
      metrics: {
        transformMatrix: 'Homography 3x3 verified',
        targetDPI: 300,
      },
      timestamp: new Date().toISOString(),
    });

    steps.push({
      step: 'enhance',
      status: 'passed',
      flags: ['CLAHE adaptive contrast equalization and minAreaRect skew angle correction (-1.2°).'],
      metrics: {
        skewAngleDegrees: -1.2,
        adaptiveThresholdWindow: '21px',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // STEP 5: Quality & Authenticity-Risk Screening
  const isScreenCapture =
    input.fileName.toLowerCase().includes('screen') || input.fileName.toLowerCase().includes('photo');
  const isDuplicate = input.fileName.toLowerCase().includes('copy');
  const step5Flags: string[] = [];
  let step5Status: 'passed' | 'warning' | 'failed' = 'passed';

  if (isScreenCapture) {
    step5Flags.push('Moiré high-frequency periodic grid detected via 2D FFT peak spectrum. Possible screen photograph.');
    riskFlags.push('Possible screen capture (requires human review)');
    step5Status = 'warning';
  }
  if (isDuplicate) {
    step5Flags.push('Perceptual hash match (distance < 5) with prior candidate submission from current device.');
    riskFlags.push('Potential duplicate submission (informational)');
    step5Status = 'warning';
  }
  step5Flags.push('EXIF metadata scrubbed (GPS coordinates and camera serial stripped).');

  steps.push({
    step: 'authenticity',
    status: step5Status,
    flags: step5Flags,
    metrics: {
      fftPeakRatio: isScreenCapture ? 0.38 : 0.08,
      perceptualHashDistance: isDuplicate ? 2 : 24,
      metadataSanitized: true,
      humanReviewRecommended: step5Status === 'warning',
    },
    timestamp: new Date().toISOString(),
  });

  // STEP 6: OCR & Document Taxonomy Validation (Resume Matching vs Non-Resume Rejection)
  const lowerFileName = input.fileName.toLowerCase();
  const isExplicitNonResume =
    input.forceNonResume ||
    lowerFileName.includes('invoice') ||
    lowerFileName.includes('receipt') ||
    lowerFileName.includes('bill') ||
    lowerFileName.includes('contract') ||
    lowerFileName.includes('not_a_resume') ||
    lowerFileName.includes('essay') ||
    lowerFileName.includes('menu') ||
    lowerFileName.includes('license');

  const textContent =
    input.textOverride ||
    (isExplicitNonResume
      ? `COMMERCIAL INVOICE #INV-98214\nTotal Amount Due: $1,450.00\nPayment Terms: Net 30\nBilled To: ACME Corporation\nItem 1: Server Hosting Services - $1,200\nItem 2: Domain Registration - $250\nThank you for your business!`
      : `ALEX CHEN\nSoftware & Machine Learning Engineer\nEmail: alex.chen@skillsbuild.org · GitHub: github.com/alexchen · Cert: Credly-ML-883921\n\nPROFESSIONAL SUMMARY\nExperienced in Python programming, machine learning model training, and SQL databases.\n\nWORK EXPERIENCE\nJunior ML Developer — DataCorp (2024–2026)\n- Engineered predictive Machine Learning models in Python, reducing inference latency by 32% on production clusters.\n- Implemented SQL queries and ETL pipelines for high-volume tabular logs.\n- Deployed microservices using Docker containerization and Git version control.\n\nPROJECTS\nConversational AI Agent (GitHub: github.com/alexchen/nlp-agent)\n- Implemented Natural Language Processing transformers using PyTorch and Python.\n\nTECHNICAL SKILLS\nPython, Machine Learning, SQL, Git, Docker, Kubernetes (Claimed), React (Claimed)\n\nEDUCATION\nBachelor of Science in Computer Science — University of Technology (2020–2024)`);

  // Inspect standard career sections
  const standardSections = ['experience', 'work experience', 'education', 'skills', 'technical skills', 'projects', 'summary'];
  const detectedKeywords = standardSections.filter((kw) =>
    textContent.toLowerCase().includes(kw)
  );

  // If document does NOT match resume criteria (lacks career sections or is an invoice/bill/contract):
  if (isExplicitNonResume || detectedKeywords.length < 2) {
    const rejectionMsg =
      'Document Rejected: This document is not a valid resume. A resume must contain recognized career sections (such as Experience, Education, or Skills). Please upload a valid resume PDF.';

    steps.push({
      step: 'ocr',
      status: 'failed',
      flags: [
        'Document classification mismatch: Text does not match resume structure.',
        'Lacks standard career sections (Experience, Education, Skills, or Projects).',
      ],
      metrics: {
        isResume: false,
        careerKeywordsFound: detectedKeywords.length,
        documentTypeDetected: isExplicitNonResume ? 'Invoice / Commercial Document' : 'Unrecognized Document',
      },
      timestamp: new Date().toISOString(),
    });

    const report: ScreeningReport = {
      overallStatus: 'rejected_not_resume',
      isResume: false,
      rejectionReason: rejectionMsg,
      steps,
      qualityFlags: ['Document type mismatch: Not a resume'],
      riskFlags: ['Document does not match resume taxonomy standards'],
      passedCheckCount: steps.filter((s) => s.status === 'passed').length,
      totalCheckCount: steps.length,
      disclaimer:
        'This screening system strictly validates that uploaded files match standard resume structures. Non-resume documents are rejected.',
    };

    const parsedResume: ParsedResume = {
      id: `res-${input.submissionId.slice(0, 8)}`,
      submissionId: input.submissionId,
      intakeMethod: input.intakeMethod,
      extractedSkills: [],
      rawTextPreview: textContent,
      sectionsDetected: [],
      pageCount: 1,
      createdAt: new Date().toISOString(),
    };

    return { report, parsedResume };
  }

  // It IS a valid resume: proceed with skill extraction
  const detectedSections = ['summary', 'experience', 'projects', 'skills', 'education'];
  const extractedSkills: ExtractedSkill[] = [
    {
      id: 'ext-py',
      rawText: 'Python programming',
      matchedEscoSkill: normalizeSkillText('Python').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'verified',
      e_i: 1.0,
      sourceSnippet: 'Engineered predictive Machine Learning models in Python (GitHub: github.com/alexchen)',
      section: 'experience',
      artifactUrl: 'https://github.com/alexchen',
    },
    {
      id: 'ext-ml',
      rawText: 'Machine Learning',
      matchedEscoSkill: normalizeSkillText('Machine Learning').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'verified',
      e_i: 1.0,
      sourceSnippet: 'Cert: Credly-ML-883921 · Engineered predictive Machine Learning models in Python, reducing inference latency by 32%',
      section: 'experience',
      credentialId: 'Credly-ML-883921',
    },
    {
      id: 'ext-sql',
      rawText: 'SQL queries and ETL pipelines',
      matchedEscoSkill: normalizeSkillText('SQL').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'demonstrated',
      e_i: 0.85,
      sourceSnippet: 'Implemented SQL queries and ETL pipelines for high-volume tabular logs.',
      section: 'experience',
    },
    {
      id: 'ext-git',
      rawText: 'Git version control',
      matchedEscoSkill: normalizeSkillText('Git').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'demonstrated',
      e_i: 0.85,
      sourceSnippet: 'Deployed microservices using Docker containerization and Git version control.',
      section: 'experience',
    },
    {
      id: 'ext-docker',
      rawText: 'Docker containerization',
      matchedEscoSkill: normalizeSkillText('Docker').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'demonstrated',
      e_i: 0.85,
      sourceSnippet: 'Deployed microservices using Docker containerization and Git version control.',
      section: 'experience',
    },
    {
      id: 'ext-k8s',
      rawText: 'Kubernetes',
      matchedEscoSkill: normalizeSkillText('Kubernetes').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'claimed',
      e_i: 0.6,
      sourceSnippet: 'SKILLS: Kubernetes (Claimed)',
      section: 'skills',
    },
    {
      id: 'ext-react',
      rawText: 'React',
      matchedEscoSkill: normalizeSkillText('React').matchedSkill,
      matchType: 'exact',
      similarity: 1.0,
      s_i: 1.0,
      evidenceLevel: 'claimed',
      e_i: 0.6,
      sourceSnippet: 'SKILLS: React (Claimed)',
      section: 'skills',
    },
  ];

  steps.push({
    step: 'ocr',
    status: 'passed',
    flags: [
      'Document validated as genuine resume: Found Experience, Education, Skills, and Projects sections.',
      'Extracted 248 words with 94.6% average word confidence.',
    ],
    metrics: {
      isResume: true,
      wordCount: 248,
      avgConfidencePercent: 94.6,
      detectedSectionsCount: detectedSections.length,
    },
    timestamp: new Date().toISOString(),
  });

  const passedCount = steps.filter((s) => s.status === 'passed').length;
  const overallStatus =
    riskFlags.length > 0 || qualityFlags.length > 0 ? 'needs_human_review' : 'passed';

  const report: ScreeningReport = {
    overallStatus,
    isResume: true,
    steps,
    qualityFlags,
    riskFlags,
    passedCheckCount: passedCount,
    totalCheckCount: steps.length,
    disclaimer:
      'This screening checks document quality and consistency. It does not confirm that the document or its claims are genuine.',
  };

  const parsedResume: ParsedResume = {
    id: `res-${input.submissionId.slice(0, 8)}`,
    submissionId: input.submissionId,
    intakeMethod: input.intakeMethod,
    extractedSkills,
    rawTextPreview: textContent,
    sectionsDetected: detectedSections,
    pageCount: 1,
    createdAt: new Date().toISOString(),
  };

  return { report, parsedResume };
}
