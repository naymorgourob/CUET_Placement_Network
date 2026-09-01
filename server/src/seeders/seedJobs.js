// Dev/demo seed: populates the Job table with realistic postings against
// EXISTING companies only. Idempotent — safe to run multiple times, keyed on
// (companyId, title). Does not create companies, recruiters, students, or
// applications. All seeded jobs are posted under an existing verified
// recruiter account (Recruiter A) — no new user accounts are created.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { jobsByCompany } = await import('./data/jobs.data.js');

const SEED_RECRUITER_EMAIL = 'recruiter.bkash@example.com';

const DAY = 24 * 60 * 60 * 1000;

function deadlineForIndex(index) {
  // Spread deadlines between ~2 and ~10 weeks out so Find Jobs shows a
  // realistic mix rather than one identical date.
  const weeksOut = 2 + (index % 9);
  const offsetDays = weeksOut * 7 + ((index * 3) % 5);
  return new Date(Date.now() + offsetDays * DAY).toISOString().slice(0, 10);
}

async function run() {
  await db.sequelize.authenticate();

  const recruiter =
    (await db.User.findOne({ where: { email: SEED_RECRUITER_EMAIL, role: 'recruiter' } })) ||
    (await db.User.findOne({ where: { role: 'recruiter' } }));

  if (!recruiter) {
    throw new Error(
      `Seed recruiter account not found. This seed reuses an existing verified recruiter as the posting user for demo jobs and does not create new accounts.`
    );
  }

  const beforeCount = await db.Job.count();

  let added = 0;
  let skipped = 0;
  let companiesNotFound = 0;
  let globalIndex = 0;

  for (const [companyName, jobs] of Object.entries(jobsByCompany)) {
    const company = await db.Company.findOne({ where: { name: companyName } });

    if (!company) {
      console.warn(`Skipping "${companyName}" — no matching company found in the database.`);
      companiesNotFound += 1;
      continue;
    }

    for (const jobData of jobs) {
      const [, created] = await db.Job.findOrCreate({
        where: { companyId: company.companyId, title: jobData.title },
        defaults: {
          postedBy: recruiter.userId,
          description: jobData.description,
          requirements: jobData.requirements,
          location: jobData.location,
          jobType: jobData.jobType,
          status: 'open',
          deadline: deadlineForIndex(globalIndex),
        },
      });

      if (created) {
        added += 1;
      } else {
        skipped += 1;
      }

      globalIndex += 1;
    }
  }

  const afterCount = await db.Job.count();

  console.log('--- Job seed report ---');
  console.log(`Jobs before:  ${beforeCount}`);
  console.log(`Jobs added:   ${added}`);
  console.log(`Jobs skipped (already existed): ${skipped}`);
  console.log(`Companies referenced but not found: ${companiesNotFound}`);
  console.log(`Jobs after:   ${afterCount}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Job seed failed:', error);
  process.exit(1);
});
