// Dev/demo seed: generates one real, valid, text-extractable PDF resume per
// seeded student and registers it exactly the way resume.service.js does
// (Resume row with filePath relative to UPLOAD_ROOT as "resumes/<file>.pdf",
// StudentProfile.currentResumeId set on first upload). Physical files are
// written into the real uploads/resumes directory used by the app's static
// file server, so View/Download work identically to a real upload.
// Idempotent — a student that already has a resume (matched by
// originalFileName, which is deterministic per student) is skipped.
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { students } = await import('./data/students.data.js');
const { generateResumePdf } = await import('./lib/generateResumePdf.js');

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_PATH || 'uploads');
const RESUME_DIR = path.join(UPLOAD_ROOT, 'resumes');

function slugifyEmail(email) {
  return email.split('@')[0].replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function buildResumeLines(student) {
  return [
    student.fullName,
    `${student.email}  |  ${student.phone}`,
    '',
    'EDUCATION',
    `Chittagong University of Engineering & Technology (CUET)`,
    `B.Sc. in ${student.department} Engineering, Batch ${student.batchYear}, CGPA ${student.cgpa}`,
    '',
    'SKILLS',
    student.skills,
    '',
    'PROJECTS',
    `Final year project and coursework in ${student.department}, with hands-on lab and design work across core and elective courses.`,
    '',
    'CAREER OBJECTIVE',
    `Motivated ${student.department} graduate from CUET seeking an entry-level opportunity to apply academic knowledge and practical skills in a professional environment.`,
  ];
}

async function run() {
  await db.sequelize.authenticate();
  await fs.mkdir(RESUME_DIR, { recursive: true });

  const beforeCount = await db.Resume.count();

  let added = 0;
  let skipped = 0;
  let studentsNotFound = 0;

  for (const entry of students) {
    const user = await db.User.findOne({ where: { email: entry.email, role: 'student' } });

    if (!user) {
      studentsNotFound += 1;
      continue;
    }

    const profile = await db.StudentProfile.findOne({ where: { userId: user.userId } });
    if (!profile) {
      studentsNotFound += 1;
      continue;
    }

    const originalFileName = `${slugifyEmail(entry.email)}-resume.pdf`;

    const existingResume = await db.Resume.findOne({
      where: { studentProfileId: profile.studentProfileId, originalFileName },
    });

    if (existingResume) {
      skipped += 1;
      continue;
    }

    const pdfBuffer = generateResumePdf(buildResumeLines(entry));
    const storedFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    const absolutePath = path.join(RESUME_DIR, storedFileName);
    await fs.writeFile(absolutePath, pdfBuffer);

    const relativeFilePath = path.join('resumes', storedFileName).split(path.sep).join('/');

    await db.sequelize.transaction(async (transaction) => {
      const resume = await db.Resume.create(
        {
          studentProfileId: profile.studentProfileId,
          filePath: relativeFilePath,
          originalFileName,
        },
        { transaction }
      );

      if (!profile.currentResumeId) {
        await profile.update({ currentResumeId: resume.resumeId }, { transaction });
      }
    });

    added += 1;
  }

  const afterCount = await db.Resume.count();

  console.log('--- Resume seed report ---');
  console.log(`Resumes before: ${beforeCount}`);
  console.log(`Resumes added:  ${added}`);
  console.log(`Resumes skipped (already existed): ${skipped}`);
  console.log(`Students not found: ${studentsNotFound}`);
  console.log(`Resumes after:  ${afterCount}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Resume seed failed:', error);
  process.exit(1);
});
