import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, ExternalLink, Download, RefreshCcw, Sparkles, ChevronDown } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ResumeListItem } from '@/features/student/components/ResumeListItem';
import { ResumeAnalysisModal } from '@/features/student/components/ResumeAnalysisModal';
import { ResumeImprovementModal } from '@/features/student/components/ResumeImprovementModal';
import { useToast } from '@/hooks/useToast';
import { env } from '@/utils/env';
import {
  useMyResumes,
  useStudentProfile,
  useUploadResume,
  useSetCurrentResume,
  useDeleteResume,
  useResumeAnalysis,
  useAnalyzeResume,
  useResumeImprovementSuggestions,
  useGenerateResumeImprovementSuggestions,
} from '@/features/student/studentQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

export function StudentResumesPage() {
  const { showToast } = useToast();
  const uploadInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const isReplacing = useRef(false);
  const [showHistory, setShowHistory] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [analysisResumeId, setAnalysisResumeId] = useState(null);
  const [improvementResumeId, setImprovementResumeId] = useState(null);

  const { data: resumes, isLoading } = useMyResumes();
  const { data: profile } = useStudentProfile();
  const uploadResume = useUploadResume();
  const setCurrentResume = useSetCurrentResume();
  const deleteResume = useDeleteResume();
  const analyzeResume = useAnalyzeResume();
  const generateSuggestions = useGenerateResumeImprovementSuggestions();

  const {
    data: existingAnalysis,
    isLoading: isAnalysisLoading,
    error: analysisFetchError,
  } = useResumeAnalysis(analysisResumeId, { enabled: Boolean(analysisResumeId) });

  const analysisNotYetCreated = analysisFetchError?.response?.status === 404;

  const {
    data: existingSuggestions,
    isLoading: isSuggestionsLoading,
    error: suggestionsFetchError,
  } = useResumeImprovementSuggestions(improvementResumeId, { enabled: Boolean(improvementResumeId) });

  const suggestionsNotYetGenerated = suggestionsFetchError?.response?.status === 404;
  const resumeNotAnalyzedYet =
    suggestionsFetchError?.response?.status === 409 || generateSuggestions.error?.response?.status === 409;

  const currentResumeId = profile?.currentResumeId;
  const currentResume = (resumes ?? []).find((resume) => resume.resumeId === currentResumeId);
  const previousResumes = (resumes ?? []).filter((resume) => resume.resumeId !== currentResumeId);

  const analysisModalOpen = Boolean(analysisResumeId);
  const analysis = existingAnalysis ?? analyzeResume.data;
  const isAnalyzing = isAnalysisLoading || analyzeResume.isPending;
  const analysisFailed = analyzeResume.isError || (Boolean(analysisFetchError) && !analysisNotYetCreated);

  const improvementModalOpen = Boolean(improvementResumeId);
  const suggestions = existingSuggestions ?? generateSuggestions.data;
  const isGeneratingSuggestions = isSuggestionsLoading || generateSuggestions.isPending;
  const suggestionsFailed =
    (generateSuggestions.isError && !resumeNotAnalyzedYet) ||
    (Boolean(suggestionsFetchError) && !suggestionsNotYetGenerated && !resumeNotAnalyzedYet);
  const suggestionsErrorMessage = resumeNotAnalyzedYet
    ? 'Analyze your resume before generating improvement suggestions.'
    : undefined;

  function handleAnalyze(resume) {
    analyzeResume.reset();
    setAnalysisResumeId(resume.resumeId);
  }

  function handleCloseAnalysis(open) {
    if (!open) {
      setAnalysisResumeId(null);
      analyzeResume.reset();
    }
  }

  const runAnalysis = useCallback(
    (resumeId) => {
      analyzeResume.mutate(resumeId, {
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Failed to analyze resume.';
          showToast({ variant: 'danger', title: 'Analysis failed', description: message });
        },
      });
    },
    [analyzeResume, showToast]
  );

  const hasAutoAnalyzed = useRef(false);

  useEffect(() => {
    if (!analysisModalOpen) {
      hasAutoAnalyzed.current = false;
      return;
    }
    if (analysisNotYetCreated && !hasAutoAnalyzed.current) {
      hasAutoAnalyzed.current = true;
      runAnalysis(analysisResumeId);
    }
  }, [analysisModalOpen, analysisNotYetCreated, analysisResumeId, runAnalysis]);

  function handleImprove(resume) {
    generateSuggestions.reset();
    setImprovementResumeId(resume.resumeId);
  }

  function handleCloseImprovement(open) {
    if (!open) {
      setImprovementResumeId(null);
      generateSuggestions.reset();
    }
  }

  const runGenerateSuggestions = useCallback(
    (resumeId) => {
      generateSuggestions.mutate(resumeId, {
        onError: (error) => {
          if (error.response?.status === 409) return;
          const message = error.response?.data?.message ?? 'Failed to generate improvement suggestions.';
          showToast({ variant: 'danger', title: 'Suggestions failed', description: message });
        },
      });
    },
    [generateSuggestions, showToast]
  );

  const hasAutoGenerated = useRef(false);

  useEffect(() => {
    if (!improvementModalOpen) {
      hasAutoGenerated.current = false;
      return;
    }
    if (suggestionsNotYetGenerated && !hasAutoGenerated.current) {
      hasAutoGenerated.current = true;
      runGenerateSuggestions(improvementResumeId);
    }
  }, [improvementModalOpen, suggestionsNotYetGenerated, improvementResumeId, runGenerateSuggestions]);

  function validateAndUpload(file, { replace }) {
    if (file.type !== 'application/pdf') {
      showToast({ variant: 'danger', title: 'Please upload a PDF resume.' });
      return;
    }

    isReplacing.current = replace;

    uploadResume.mutate(file, {
      onSuccess: (uploaded) => {
        if (replace && uploaded?.resumeId) {
          setCurrentResume.mutate(uploaded.resumeId, {
            onSuccess: () => showToast({ variant: 'success', title: 'Resume uploaded successfully.' }),
            onError: () => showToast({ variant: 'success', title: 'Resume uploaded successfully.' }),
          });
        } else {
          showToast({ variant: 'success', title: 'Resume uploaded successfully.' });
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to upload resume.';
        showToast({ variant: 'danger', title: 'Upload failed', description: message });
      },
    });
  }

  function handleUploadSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    validateAndUpload(file, { replace: false });
  }

  function handleReplaceSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    validateAndUpload(file, { replace: true });
  }

  function handleSetCurrent(resumeId) {
    setCurrentResume.mutate(resumeId, {
      onSuccess: () => showToast({ variant: 'success', title: 'Current resume updated.' }),
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to update current resume.';
        showToast({ variant: 'danger', title: 'Update failed', description: message });
      },
    });
  }

  function handleConfirmDelete() {
    if (!resumeToDelete) return;

    deleteResume.mutate(resumeToDelete.resumeId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'Resume deleted.' });
        setResumeToDelete(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to delete resume.';
        showToast({ variant: 'danger', title: 'Delete failed', description: message });
        setResumeToDelete(null);
      },
    });
  }

  const resumeUrl = currentResume
    ? `${env.uploadBaseUrl}/${currentResume.filePath.replace(/^\/?/, '')}`
    : null;
  const isUploadPending = uploadResume.isPending || setCurrentResume.isPending;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">My Resume</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage the resume you use for job applications and AI career tools.
        </p>
      </motion.div>

      <motion.div {...fadeUp}>
        {isLoading ? (
          <Card>
            <CardBody className="flex items-center gap-4 p-6">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </CardBody>
          </Card>
        ) : !currentResume ? (
          <Card>
            <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
              <FileText className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-base font-semibold text-text">You haven't uploaded a resume yet.</p>
              <p className="max-w-sm text-sm text-text-muted">
                Upload your resume to apply to jobs and use AI career tools.
              </p>
              <input ref={uploadInputRef} type="file" accept="application/pdf" hidden onChange={handleUploadSelect} />
              <Button
                leftIcon={Upload}
                isLoading={isUploadPending}
                onClick={() => uploadInputRef.current?.click()}
                className="mt-1"
              >
                Upload Resume
              </Button>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="flex flex-col gap-5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-text">{currentResume.originalFileName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span>Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}</span>
                    <span aria-hidden="true">•</span>
                    <span>File type: PDF</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" leftIcon={ExternalLink}>
                    View Resume
                  </Button>
                </a>
                <a href={resumeUrl} download={currentResume.originalFileName}>
                  <Button variant="outline" leftIcon={Download}>
                    Download
                  </Button>
                </a>
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleReplaceSelect}
                />
                <Button
                  variant="outline"
                  leftIcon={RefreshCcw}
                  isLoading={isUploadPending && isReplacing.current}
                  disabled={isUploadPending}
                  onClick={() => replaceInputRef.current?.click()}
                >
                  Replace Resume
                </Button>
              </div>
              <p className="text-xs text-text-muted">PDF only, up to 5MB.</p>
            </CardBody>
          </Card>
        )}
      </motion.div>

      {currentResume && (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">AI Career Tools</p>
                  <p className="text-sm text-text-muted">
                    Use your resume to get AI-powered feedback and career insights.
                  </p>
                </div>
              </div>
              <Link to="/student/ai-tools" className="shrink-0">
                <Button variant="outline">Review Resume with AI</Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {previousResumes.length > 0 && (
        <motion.div {...fadeUp} className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowHistory((open) => !open)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-150 ${showHistory ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Previous Versions ({previousResumes.length})
          </button>

          {showHistory && (
            <div className="flex flex-col gap-3">
              {previousResumes.map((resume) => (
                <ResumeListItem
                  key={resume.resumeId}
                  resume={resume}
                  isCurrent={false}
                  isUpdating={setCurrentResume.isPending || deleteResume.isPending}
                  onSetCurrent={handleSetCurrent}
                  onDelete={setResumeToDelete}
                  onAnalyze={handleAnalyze}
                  onImprove={handleImprove}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      <ConfirmDialog
        open={Boolean(resumeToDelete)}
        onOpenChange={(open) => !open && setResumeToDelete(null)}
        title="Delete this resume?"
        description="This will permanently remove the resume file from your account."
        confirmLabel="Delete"
        isLoading={deleteResume.isPending}
        onConfirm={handleConfirmDelete}
      />

      <ResumeAnalysisModal
        open={analysisModalOpen}
        onOpenChange={handleCloseAnalysis}
        analysis={analysis}
        isLoading={isAnalyzing}
        isError={analysisFailed}
        onRetry={() => runAnalysis(analysisResumeId)}
      />

      <ResumeImprovementModal
        open={improvementModalOpen}
        onOpenChange={handleCloseImprovement}
        suggestions={suggestions}
        isLoading={isGeneratingSuggestions}
        isError={suggestionsFailed || resumeNotAnalyzedYet}
        errorMessage={suggestionsErrorMessage}
        onRetry={resumeNotAnalyzedYet ? undefined : () => runGenerateSuggestions(improvementResumeId)}
      />
    </div>
  );
}
