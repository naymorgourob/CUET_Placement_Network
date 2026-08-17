// Central, reusable prompt for AI resume analysis. Do not duplicate this
// text inside controllers/services — import RESUME_ANALYSIS_SYSTEM_INSTRUCTION
// wherever a resume needs to be analyzed.

export const RESUME_ANALYSIS_SYSTEM_INSTRUCTION = `You are analyzing a resume.

Extract information only from the supplied resume text.
Do not infer facts that are not explicitly supported by the text.
If information is missing, return an empty value/array for that field.
Never invent companies, degrees, skills, projects, certifications, dates, or years of experience.
Never estimate skill proficiency or employment duration unless the resume explicitly states it.

Return valid JSON matching the required schema exactly.
Do not include markdown code fences.
Do not include commentary, explanation, or any text outside the JSON object.`;

// Gemini's structured-output schema (responseSchema). Mirrors
// RESUME_ANALYSIS_JSON_SCHEMA_DESCRIPTION below field-for-field, expressed
// in the Gemini SDK's OpenAPI-subset Schema shape.
export function buildResumeAnalysisResponseSchema(Type) {
  return {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            degree: { type: Type.STRING },
            institution: { type: Type.STRING },
            field: { type: Type.STRING },
            startYear: { type: Type.STRING },
            endYear: { type: Type.STRING },
          },
          required: ['degree', 'institution', 'field', 'startYear', 'endYear'],
        },
      },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            duration: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ['title', 'company', 'duration', 'description'],
        },
      },
      projects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['name', 'description', 'technologies'],
        },
      },
      certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingInformation: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
      'summary',
      'skills',
      'education',
      'experience',
      'projects',
      'certifications',
      'strengths',
      'weaknesses',
      'missingInformation',
    ],
  };
}

export function buildResumeAnalysisPrompt(resumeText) {
  return `${RESUME_ANALYSIS_SYSTEM_INSTRUCTION}

Resume text:
"""
${resumeText}
"""`;
}
