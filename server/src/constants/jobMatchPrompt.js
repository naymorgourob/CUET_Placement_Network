// Central, reusable prompt for AI job match scoring. Do not duplicate this
// text inside controllers/services — import buildJobMatchPrompt wherever a
// resume needs to be scored against a job.
//
// Like Feature 07's prompt, this never receives raw resume text or the
// PDF — only the already-extracted, already-validated structured
// ResumeAnalysis fields, plus the job's own stored fields (title,
// description, requirements, jobType). See
// docs/Feature08_AIJobMatchScore.md §4.

export const JOB_MATCH_SYSTEM_INSTRUCTION = `You are evaluating how well a candidate's resume matches a specific job.

You will be given two clearly separated inputs: RESUME DATA and JOB DATA.
Evaluate only the supplied information. Do not invent facts about the
candidate or the job.

Do not claim the candidate has a skill, degree, certification, project, or
years of experience that is not present in RESUME DATA.
Do not assume a requirement exists in JOB DATA unless it is explicitly
stated there.

Base matchScore strictly on evidence: skills, education, experience, and
projects in RESUME DATA that align with what JOB DATA actually asks for.
Do not award points for vague impressions — every matching or missing
item must be traceable to specific resume or job content.

matchScore must be an integer from 0 to 100 (never negative, never above
100, never a string, never include a percent sign).

Recommendations must be actionable and clearly distinguish something the
candidate should add or learn from something they already have. If a
requirement's importance is uncertain from the job data, say so explicitly
rather than guessing.

Return valid JSON matching the required schema exactly.
Do not include markdown code fences.
Do not include commentary, explanation, or any text outside the JSON object.`;

export function buildJobMatchResponseSchema(Type) {
  return {
    type: Type.OBJECT,
    properties: {
      matchScore: { type: Type.INTEGER },
      summary: { type: Type.STRING },
      matchingSkills: {
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
      missingSkills: {
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
      matchingQualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
      gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
      strengthsForThisJob: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
      'matchScore',
      'summary',
      'matchingSkills',
      'missingSkills',
      'matchingQualifications',
      'gaps',
      'strengthsForThisJob',
      'recommendations',
    ],
  };
}

// Builds the prompt from the stored ResumeAnalysis fields (never raw resume
// text/PDF) and the job's own stored fields (never invented ones). No
// contact information, credentials, or unrelated personal data is included
// — ResumeAnalysis itself contains none.
export function buildJobMatchPrompt(analysis, job) {
  const resumeData = {
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

  const jobData = {
    title: job.title,
    jobType: job.jobType,
    description: job.description,
    requirements: job.requirements,
  };

  return `${JOB_MATCH_SYSTEM_INSTRUCTION}

RESUME DATA (already extracted from the candidate's resume):
${JSON.stringify(resumeData, null, 2)}

JOB DATA (the posting to evaluate against):
${JSON.stringify(jobData, null, 2)}`;
}
