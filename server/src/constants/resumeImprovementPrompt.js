// Central, reusable prompt for AI resume improvement suggestions. Do not
// duplicate this text inside controllers/services — import
// RESUME_IMPROVEMENT_SYSTEM_INSTRUCTION wherever suggestions are generated.
//
// Unlike Feature 06's prompt (resumeAnalysisPrompt.js), this prompt never
// receives raw resume text or the PDF — only the already-extracted,
// already-validated structured ResumeAnalysis fields. See
// docs/Feature07_AIResumeImprovement.md §3.

export const RESUME_IMPROVEMENT_SYSTEM_INSTRUCTION = `You are reviewing an existing structured resume analysis.

Do not invent facts. Do not claim the student possesses skills, experience,
companies, degrees, or certifications that are not present in the supplied
analysis.
Do not rewrite the resume. Do not generate replacement resume content.
Do not fabricate achievements, metrics, or outcomes on the student's behalf
— instead, suggest that the student add such details only if true.

Give specific, actionable suggestions grounded only in the supplied
analysis. Avoid generic advice.

When suggesting a new skill to learn, clearly identify it as a skill to
consider learning, not a skill the student already has. Never present a
recommended skill as an existing one.

Do not force suggestions for sections that are already strong — omit a
category entirely (empty array) if there is nothing meaningful to add for it.

Return valid JSON matching the required schema exactly.
Do not include markdown code fences.
Do not include commentary, explanation, or any text outside the JSON object.`;

export function buildResumeImprovementResponseSchema(Type) {
  return {
    type: Type.OBJECT,
    properties: {
      overallAssessment: { type: Type.STRING },
      priorityImprovements: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            area: { type: Type.STRING },
            issue: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
          },
          required: ['area', 'issue', 'suggestion', 'priority'],
        },
      },
      skillSuggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            reason: { type: Type.STRING },
          },
          required: ['skill', 'reason'],
        },
      },
      contentSuggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ['section', 'suggestion'],
        },
      },
      missingInformation: { type: Type.ARRAY, items: { type: Type.STRING } },
      actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
      'overallAssessment',
      'priorityImprovements',
      'skillSuggestions',
      'contentSuggestions',
      'missingInformation',
      'actionItems',
    ],
  };
}

// Builds the prompt from the stored, already-validated ResumeAnalysis
// fields only — never the raw resume text/PDF. Deliberately omits nothing
// that would help ground suggestions, and deliberately includes nothing
// beyond what Feature 06 already extracted (no personal contact details
// are stored on ResumeAnalysis in the first place, so there is nothing
// extraneous to strip here).
export function buildResumeImprovementPrompt(analysis) {
  const structuredInput = {
    summary: analysis.summary,
    skills: analysis.skills,
    education: analysis.education,
    experience: analysis.experience,
    projects: analysis.projects,
    certifications: analysis.certifications,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    missingInformation: analysis.missingInformation,
  };

  return `${RESUME_IMPROVEMENT_SYSTEM_INSTRUCTION}

Structured resume analysis (already extracted from the resume — do not
re-derive or contradict this data, only build suggestions from it):
${JSON.stringify(structuredInput, null, 2)}`;
}
