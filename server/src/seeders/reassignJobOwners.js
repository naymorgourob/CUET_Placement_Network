// One-time dev/demo fix: the original seedJobs.js posted every job under a
// single recruiter (Recruiter A / "Test Company A") regardless of which
// company the job actually belongs to. This reassigns each job's postedBy
// to that company's own verified recruiter (seeded by seedRecruiters.js),
// so "my jobs", ownership checks, and applicant views are consistent with
// the correct company. Idempotent — re-running is a no-op once every job's
// postedBy already matches its company's recruiter. Never touches
// companyId, title, description, or any other job content.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');

async function run() {
  await db.sequelize.authenticate();

  const jobs = await db.Job.findAll({ include: [{ model: db.Company, attributes: ['companyId', 'name'] }] });

  let reassigned = 0;
  let alreadyCorrect = 0;
  let noRecruiterFound = 0;

  for (const job of jobs) {
    const recruiterProfile = await db.RecruiterProfile.findOne({ where: { companyId: job.companyId } });

    if (!recruiterProfile) {
      console.warn(`No recruiter found for company "${job.Company?.name}" (job "${job.title}", jobId ${job.jobId}) — leaving postedBy unchanged.`);
      noRecruiterFound += 1;
      continue;
    }

    if (job.postedBy === recruiterProfile.userId) {
      alreadyCorrect += 1;
      continue;
    }

    await job.update({ postedBy: recruiterProfile.userId });
    reassigned += 1;
  }

  console.log('--- Job ownership reassignment report ---');
  console.log(`Jobs inspected:      ${jobs.length}`);
  console.log(`Reassigned:          ${reassigned}`);
  console.log(`Already correct:     ${alreadyCorrect}`);
  console.log(`No recruiter found:  ${noRecruiterFound}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Job ownership reassignment failed:', error);
  process.exit(1);
});
