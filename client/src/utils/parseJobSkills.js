const SKILLS_PATTERN = /(?:required\s+)?skills?\s*:\s*(.+?)\.?\s*$/i;

export function parseJobSkills(requirements) {
  if (!requirements) return [];

  const match = requirements.match(SKILLS_PATTERN);
  if (!match) return [];

  return match[1]
    .split(',')
    .map((skill) => skill.trim().replace(/\.$/, ''))
    .filter(Boolean);
}
