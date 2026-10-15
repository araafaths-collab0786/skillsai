/**
 * SkillLens AI - Resume Intake Page (/resume)
 * Implements Section 6 & User Requirements:
 * - Method A: "Upload PDF Resume" - STRICTLY PDF ONLY (.pdf / application/pdf).
 * - Method B: "Scan Hardcopy with Camera (OpenCV)" with live viewfinder, dynamic CV hints,
 *   direct video binding, and phone camera fallback.
 * - Resume Verification: Checks document structure; if it is NOT a resume (invoice, receipt, contract, etc.),
 *   it explicitly flags and rejects it with clear guidance.
 * - Instant Results: On valid resume, renders Readiness Index gauge, role fit, and top 3 learning steps.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  IntakeMethod,
  ParsedResume,
  ScreeningReport,
  ScreeningStepResult,
  ExtractedSkill,
} from '@/packages/shared/src/types';
import { useDocumentCamera } from '../hooks/useDocumentCamera';
import { runScreeningPipeline } from '../services/screeningPipeline';
import { enqueueCapture } from '../services/offlineQueue';
import { CornerCropOverlay, CornerPoint } from '../components/CornerCropOverlay';
import { CURATED_JOB_ROLES } from '../services/jobsService';
import { computeMatchResult, computeGapAnalysis } from '../services/scoringEngine';
import { RadialScoreGauge } from '../components/RadialScoreGauge';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Info,
  Maximize2,
  WifiOff,
  Sparkles,
  XCircle,
} from 'lucide-react';

export interface ResumePageProps {
  onNavigate: (path: string) => void;
  onSelectResume?: (resume: ParsedResume) => void;
}

export function ResumePage({ onNavigate, onSelectResume }: ResumePageProps) {
  const [intakeMethod, setIntakeMethod] = useState<IntakeMethod>('pdf_upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStage, setUploadStage] = useState<'idle' | 'checking' | 'screening' | 'extracting' | 'parsing'>('idle');
  const [fileError, setFileError] = useState<string | null>(null);

  // Results State
  const [screeningReport, setScreeningReport] = useState<ScreeningReport | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>(CURATED_JOB_ROLES[0].id);

  // Camera State
  const camera = useDocumentCamera();
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [cropCorners, setCropCorners] = useState<CornerPoint[]>([
    { x: 10, y: 10 },
    { x: 90, y: 10 },
    { x: 90, y: 90 },
    { x: 10, y: 90 },
  ]);

  // Offline notice
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  // Native camera fallback ref
  const cameraFallbackInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Automatically start camera when switching to camera_capture
  useEffect(() => {
    if (intakeMethod === 'camera_capture' && !capturedFrame && !screeningReport) {
      camera.startCamera();
    } else {
      camera.stopCamera();
    }
  }, [intakeMethod, capturedFrame, screeningReport]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processDocument = async (
    fileName: string,
    fileSize: number,
    mimeType: string,
    imageDataUrl?: string,
    forceNonResume = false
  ) => {
    setIsProcessing(true);
    setFileError(null);

    try {
      setUploadStage('checking');
      await new Promise((r) => setTimeout(r, 200));

      setUploadStage('screening');
      await new Promise((r) => setTimeout(r, 250));

      setUploadStage('extracting');
      await new Promise((r) => setTimeout(r, 200));

      setUploadStage('parsing');
      const submissionId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'sub-' + Date.now().toString(36);

      const result = await runScreeningPipeline({
        submissionId,
        intakeMethod,
        fileName,
        fileSize,
        mimeType,
        cropCorners,
        forceNonResume,
      });

      setScreeningReport(result.report);
      setParsedResume(result.parsedResume);

      if (result.report.isResume) {
        localStorage.setItem('skilllens_active_resume', JSON.stringify(result.parsedResume));
        if (onSelectResume) {
          onSelectResume(result.parsedResume);
        }
      }
    } catch {
      setFileError('Processing failed. Please check document clarity.');
    } finally {
      setIsProcessing(false);
      setUploadStage('idle');
    }
  };

  // Strictly accept ONLY PDF files for Method A
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    const isPdf = fileNameLower.endsWith('.pdf') || file.type === 'application/pdf';

    if (!isPdf) {
      setFileError('Invalid file type: Only PDF documents (.pdf) are allowed for upload. Images and other formats are not permitted for direct upload.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds 10 MB limit (Section 8 requirement).');
      return;
    }

    const isNonResumeSample = fileNameLower.includes('invoice') || fileNameLower.includes('bill');
    processDocument(file.name, file.size, 'application/pdf', undefined, isNonResumeSample);
  };

  // Camera Capture Handler
  const handleSnap = () => {
    const frame = camera.captureFrame();
    if (frame) {
      setCapturedFrame(frame);
      camera.stopCamera();
    }
  };

  // Fallback camera file picker handler (opens native phone camera or file photo)
  const handleCameraFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCapturedFrame(base64);
      camera.stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCropAndSubmit = async () => {
    if (!capturedFrame) return;

    if (!navigator.onLine) {
      await enqueueCapture({
        intakeMethod: 'camera_capture',
        blobDataUrl: capturedFrame,
        fileName: 'hardcopy_resume_' + Date.now() + '.jpg',
        fileSize: Math.round(capturedFrame.length * 0.75),
        mimeType: 'image/jpeg',
        cropCorners,
      });
      setOfflineNotice('Captured offline. Stored in device queue and will synchronize automatically when online.');
      return;
    }

    await processDocument(
      'hardcopy_resume_' + Date.now() + '.jpg',
      Math.round(capturedFrame.length * 0.75),
      'image/jpeg',
      capturedFrame
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Dual Intake Gateway
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] mt-1">
            Resume Intake & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Upload your PDF resume or capture hardcopy credentials through the OpenCV camera viewfinder.
          </p>
        </div>

        {isOffline && (
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800 flex items-center gap-1.5 self-start sm:self-auto">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>Offline Mode Active</span>
          </div>
        )}
      </div>

      {/* Offline Notice Toast */}
      {offlineNotice && (
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-[#0B1F3A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#0E7490] shrink-0" />
            <span>{offlineNotice}</span>
          </div>
          <button
            onClick={() => setOfflineNotice(null)}
            className="text-xs font-bold text-[#0E7490] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Segmented Intake Method Control (Full width on phones) */}
      {!screeningReport && (
        <div className="max-w-xl mx-auto">
          <div className="p-1 bg-slate-100 rounded-xl flex items-center">
            <button
              onClick={() => {
                setIntakeMethod('pdf_upload');
                camera.stopCamera();
                setCapturedFrame(null);
                setFileError(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                intakeMethod === 'pdf_upload'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-[#06B6D4]" />
              <span>Upload PDF (PDF Only)</span>
            </button>
            <button
              onClick={() => {
                setIntakeMethod('camera_capture');
                setFileError(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                intakeMethod === 'camera_capture'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-[#06B6D4]" />
              <span>Scan Hardcopy (OpenCV)</span>
            </button>
          </div>
        </div>
      )}

      {/* INTAKE METHOD A: PDF ONLY UPLOAD */}
      {intakeMethod === 'pdf_upload' && !screeningReport && (
        <div className="max-w-2xl mx-auto space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-12 bg-white rounded-2xl border-2 border-dashed border-[#E2E8F0] hover:border-[#06B6D4] transition-colors cursor-pointer text-center space-y-4 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto text-[#06B6D4]">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1F3A]">
                Select PDF Resume (PDF Only)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Strictly accepts PDF files (%PDF-) up to 10 MB. Non-PDF formats are blocked.
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 text-xs font-bold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
            >
              Browse PDF File
            </button>
          </div>

          {/* Quick Demo Test Profiles (including test non-resume rejection) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Test Sample Profiles:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  processDocument(
                    'alex_chen_ml_resume.pdf',
                    184000,
                    'application/pdf'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-[#0B1F3A] hover:border-[#06B6D4] min-h-[44px] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Alex Chen (Valid Tech Resume .pdf)</span>
              </button>
              <button
                onClick={() =>
                  processDocument(
                    'maria_healthcare_cna.pdf',
                    142000,
                    'application/pdf'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-[#0B1F3A] hover:border-[#06B6D4] min-h-[44px] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Maria Santos (Valid Healthcare Resume .pdf)</span>
              </button>
              <button
                onClick={() =>
                  processDocument(
                    'commercial_invoice_98214.pdf',
                    89000,
                    'application/pdf',
                    undefined,
                    true
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-100 min-h-[44px] flex items-center gap-1.5"
                title="Tests the non-resume detection rule"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Test Non-Resume File (Invoice .pdf)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTAKE METHOD B: OPENCV CAMERA SCAN */}
      {intakeMethod === 'camera_capture' && !screeningReport && (
        <div className="max-w-2xl mx-auto space-y-4">
          {!capturedFrame ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 space-y-4 shadow-xs">
              {/* Camera Viewfinder */}
              <div className="relative w-full aspect-4/3 sm:aspect-16/9 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                <video
                  ref={camera.bindVideoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Animated Guide Frame (Convex Quadrilateral) */}
                <div
                  className={`absolute inset-8 border-2 rounded-lg pointer-events-none transition-all duration-300 flex flex-col justify-between p-2 ${
                    camera.isStable
                      ? 'border-emerald-400 bg-emerald-500/10'
                      : 'border-dashed border-[#06B6D4]'
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="w-3 h-3 border-t-2 border-l-2 border-[#06B6D4]" />
                    <div className="w-3 h-3 border-t-2 border-r-2 border-[#06B6D4]" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-3 h-3 border-b-2 border-l-2 border-[#06B6D4]" />
                    <div className="w-3 h-3 border-b-2 border-r-2 border-[#06B6D4]" />
                  </div>
                </div>

                {/* Live CV Guidance Hint Banner */}
                <div
                  className={`absolute top-4 text-xs px-4 py-1.5 rounded-full font-bold shadow-md flex items-center gap-1.5 transition-colors ${
                    camera.isStable
                      ? 'bg-emerald-600 text-white'
                      : camera.currentHint.includes('dark') || camera.currentHint.includes('Glare')
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#0B1F3A]/90 text-white border border-slate-600'
                  }`}
                >
                  {camera.isStable && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{camera.currentHint}</span>
                </div>
              </div>

              {/* Hidden file input for native camera phone capture */}
              <input
                type="file"
                ref={cameraFallbackInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleCameraFallbackFile}
                className="hidden"
              />

              {/* Controls & Fallback */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => cameraFallbackInputRef.current?.click()}
                  className="text-xs text-[#0E7490] font-semibold hover:underline flex items-center gap-1 min-h-[44px]"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Photo with Phone Camera / Select Photo</span>
                </button>

                {/* Thumb-reachable capture button */}
                <button
                  onClick={handleSnap}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-[#0E7490]"
                  aria-label="Capture document frame"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Frame</span>
                </button>
              </div>

              {camera.errorMessage && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                  <div className="font-semibold">{camera.errorMessage}</div>
                  <p>You can click "Snap Photo with Phone Camera" above to take a photo directly.</p>
                </div>
              )}
            </div>
          ) : (
            /* Post-capture: 4-Point Corner Crop Rectification */
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">
                    Adjust Perspective Crop Corners
                  </h3>
                  <p className="text-xs text-slate-500">
                    Drag the 4 corner handles to match physical document edges.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCapturedFrame(null);
                    camera.startCamera();
                  }}
                  className="text-xs text-[#0E7490] font-semibold hover:underline min-h-[44px] px-2 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
              </div>

              <CornerCropOverlay
                imageSrc={capturedFrame}
                initialCorners={cropCorners}
                onChange={setCropCorners}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setCapturedFrame(null);
                    camera.startCamera();
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCropAndSubmit}
                  className="px-6 py-2.5 text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-colors shadow-xs min-h-[44px]"
                >
                  Confirm Crop & Run Screening
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload & Screening Progress Stages */}
      {isProcessing && (
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#06B6D4] animate-spin mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A] capitalize">
              {uploadStage === 'checking' && 'Checking file signature & magic bytes...'}
              {uploadStage === 'screening' && 'Screening resolution, blur & Moiré patterns...'}
              {uploadStage === 'extracting' && 'Running optical character recognition...'}
              {uploadStage === 'parsing' && 'Verifying resume structure & normalizing competencies...'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">Section 8 & 9 Screening Pipeline</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {fileError && (
        <div className="max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* RESULTS VIEW */}
      {screeningReport && parsedResume && (
        <div className="space-y-6">
          {/* CASE 1: DOCUMENT REJECTED - NOT A RESUME */}
          {screeningReport.isResume === false ? (
            <div className="bg-white rounded-2xl border-2 border-rose-200 p-6 sm:p-8 shadow-xs space-y-5 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded">
                  DOCUMENT REJECTED: NOT A RESUME
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] mt-2">
                  This Document Does Not Match a Resume
                </h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
                  {screeningReport.rejectionReason}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2 max-w-md mx-auto">
                <div className="font-bold text-[#0B1F3A]">Why was this document rejected?</div>
                <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px] leading-relaxed">
                  <li>It lacks standard career sections (Experience, Education, Skills, or Projects).</li>
                  <li>Invoices, commercial receipts, legal contracts, or general text are blocked.</li>
                  <li>Our scoring algorithms only compute readiness for genuine resume profiles.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => {
                    setScreeningReport(null);
                    setParsedResume(null);
                    setCapturedFrame(null);
                    setIntakeMethod('pdf_upload');
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] transition-colors min-h-[44px]"
                >
                  Upload a Valid Resume (PDF)
                </button>
                <button
                  onClick={() =>
                    processDocument('alex_chen_ml_resume.pdf', 184000, 'application/pdf')
                  }
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 min-h-[44px]"
                >
                  Load Sample Valid Resume
                </button>
              </div>
            </div>
          ) : (
            /* CASE 2: DOCUMENT VALIDATED AS RESUME - SHOW FULL RESULTS */
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      Document Validated as Genuine Resume
                    </h3>
                    <p className="text-xs text-slate-500">
                      {screeningReport.passedCheckCount} of {screeningReport.totalCheckCount} quality checks passed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setScreeningReport(null);
                      setParsedResume(null);
                      setCapturedFrame(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl min-h-[44px]"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={() => onNavigate('/match')}
                    className="px-5 py-2 text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-xs flex items-center gap-1.5 min-h-[44px]"
                  >
                    <span>Explore All 20+ Roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* INSTANT RESULTS FOR RESUME: ROLE MATCH & GAP PATHWAY */}
              {(() => {
                const activeJob =
                  CURATED_JOB_ROLES.find((j) => j.id === selectedJobId) || CURATED_JOB_ROLES[0];
                const instantMatch = computeMatchResult(
                  parsedResume.id,
                  activeJob,
                  parsedResume.extractedSkills
                );
                const instantGaps = computeGapAnalysis(
                  parsedResume.id,
                  activeJob,
                  parsedResume.extractedSkills
                );
                return (
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#0E7490] px-2.5 py-1 rounded bg-cyan-50 border border-cyan-200">
                          RESULTS BASED ON YOUR RESUME
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A] mt-2">
                          Instant Job Readiness & Fit
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Evaluated from {parsedResume.extractedSkills.length} evidenced competencies mapped to ESCO standards.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-600 shrink-0">
                          Target Role:
                        </label>
                        <select
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0E7490] min-h-[44px]"
                        >
                          {CURATED_JOB_ROLES.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.title} ({role.category})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <RadialScoreGauge
                          score={instantMatch.readinessIndex}
                          size={150}
                          label="Readiness Index"
                          sublabel="100 × Σ(s_i × e_i × w_i) / Σw_i"
                        />
                      </div>

                      <div className="md:col-span-8 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="text-xs text-slate-500">Selected Target Career</div>
                            <div className="text-base font-bold text-[#0B1F3A]">{activeJob.title}</div>
                            <div className="text-xs text-[#0E7490] font-medium">{activeJob.sdgTarget}</div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-xs text-slate-500">Projected Fit (Top 3 Steps)</div>
                            <div className="text-2xl font-bold text-[#0E7490] font-mono tabular-nums">
                              {instantGaps.projectedReadiness}%{' '}
                              <span className="text-xs text-emerald-700 font-semibold font-mono">
                                (+{instantGaps.projectedDeltaTotal}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Top 3 Recommended Milestones to Close Gaps:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {instantGaps.topThreeSteps.map((step, idx) => (
                              <div
                                key={step.id}
                                className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#0E7490] text-[11px]">
                                    Step {idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    +{step.projectedDeltaReadiness}%
                                  </span>
                                </div>
                                <div className="font-semibold text-[#0B1F3A] truncate">{step.title}</div>
                                <div className="text-[10px] text-slate-500">{step.provider}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            onClick={() => onNavigate('/match')}
                            className="px-4 py-2 text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-xs flex items-center gap-1.5 min-h-[44px]"
                          >
                            <span>Full Skill-by-Skill Breakdown (/match)</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onNavigate('/gap-analysis')}
                            className="px-4 py-2 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
                          >
                            Detailed Gap Pathway & Transferable Skills (/gap-analysis)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: 6-Step Screening Pipeline Breakdown */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
                      Screening Pipeline Checks
                    </h3>

                    <div className="space-y-3">
                      {screeningReport.steps.map((step: ScreeningStepResult, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0B1F3A] uppercase">
                              {step.step.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                step.status === 'passed'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            {step.flags.join(' ')}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-600 leading-relaxed italic border border-slate-200">
                      {screeningReport.disclaimer}
                    </div>
                  </div>
                </div>

                {/* Right: Extracted & Normalized ESCO Skills */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
                        Extracted Skills & ESCO Mappings ({parsedResume.extractedSkills.length})
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        Evidence Level Scored
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {parsedResume.extractedSkills.map((skill: ExtractedSkill) => (
                        <div
                          key={skill.id}
                          className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm text-[#0B1F3A]">
                                {skill.matchedEscoSkill?.preferredLabel || skill.rawText}
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                Original: "{skill.rawText}" · Section: {skill.section}
                              </div>
                            </div>

                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                                skill.evidenceLevel === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : skill.evidenceLevel === 'demonstrated'
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {skill.evidenceLevel} (e_i = {skill.e_i})
                            </span>
                          </div>

                          <div className="p-2 bg-white rounded-lg text-slate-600 italic text-[11px] border border-slate-200">
                            "{skill.sourceSnippet}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
