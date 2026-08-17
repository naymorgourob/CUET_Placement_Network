// Generates a minimal, valid, text-extractable single-page PDF from plain
// text lines, using raw PDF syntax (no external PDF-generation dependency
// exists in this project). Text is drawn with the standard Helvetica base14
// font via Tj operators, which pdf-parse (used by the AI resume features)
// can read back out — verified against a real seeded file.
function escapePdfText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapLine(line, maxChars) {
  if (line.length <= maxChars) return [line];
  const words = line.split(' ');
  const wrapped = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) wrapped.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) wrapped.push(current);
  return wrapped;
}

export function generateResumePdf(lines) {
  const wrapped = lines.flatMap((line) => (line === '' ? [''] : wrapLine(line, 95)));

  const fontSize = 11;
  const leading = 15;
  const startY = 770;
  const startX = 50;

  const textOps = wrapped
    .map((line, index) => {
      const y = startY - index * leading;
      if (y < 40) return null;
      return `BT /F1 ${fontSize} Tf ${startX} ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .filter(Boolean)
    .join('\n');

  const contentStream = textOps;
  const contentLength = Buffer.byteLength(contentStream, 'utf8');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((obj, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  const objectCount = objects.length + 1;

  let xref = `xref\n0 ${objectCount}\n0000000000 65535 f \n`;
  for (let i = 1; i < objectCount; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += xref;
  pdf += `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
}
