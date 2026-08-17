// Dev/demo seed: the base job seed (seedJobs.js) posts every job as 'open'.
// For a realistic demo, a portion of older/older-looking postings should
// read as 'closed' (recruiter stopped accepting applications) — using the
// same status enum and update path as job.service.js's closeJob (no new
// states, no direct SQL). Idempotent — deterministic selection by jobId, so
// re-running always closes the exact same subset and never keeps closing
// more jobs on each run.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');

// Close roughly 1 in 5 open jobs, chosen deterministically (not randomly)
// so re-running the seed doesn't creep the closed count upward.
const CLOSE_EVERY_NTH = 5;

async function run() {
  await db.sequelize.authenticate();

  // Selection is keyed on jobId over ALL non-removed jobs (not the current
  // 'open' set), so re-running never re-evaluates "every Nth open job"
  // against an already-shrunken pool — that would close more jobs each run.
  const candidateJobs = await db.Job.findAll({
    where: { status: ['open', 'closed'] },
    order: [['jobId', 'ASC']],
  });

  let closed = 0;

  for (const [index, job] of candidateJobs.entries()) {
    const shouldBeClosed = (index + 1) % CLOSE_EVERY_NTH === 0;

    if (shouldBeClosed && job.status !== 'closed') {
      await job.update({ status: 'closed' });
      closed += 1;
    } else if (!shouldBeClosed && job.status !== 'open') {
      await job.update({ status: 'open' });
    }
  }

  const statusCounts = await db.Job.findAll({
    attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('job_id')), 'count']],
    group: ['status'],
    raw: true,
  });

  console.log('--- Job status mix report ---');
  console.log(`Jobs newly closed this run: ${closed}`);
  console.log('Status distribution:', JSON.stringify(statusCounts));

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Job status mix seed failed:', error);
  process.exit(1);
});
