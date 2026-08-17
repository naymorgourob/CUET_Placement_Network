// Dev/demo seed: creates realistic Student -> Job applications, replicating
// exactly what application.service.js's applyForJob (and, for status
// changes, updateApplicationStatus) does — same fields, same notification
// types/messages, same resumeId-at-time-of-application semantics (Resume is
// pinned to the resume that was current for that student, matching the real
// service, not "whatever their latest resume is now"). Idempotent — keyed
// on the (jobId, studentProfileId) unique constraint already enforced by
// the Application model; a pair that already has an application is skipped.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { NOTIFICATION_TYPES, RELATED_ENTITY_TYPES, APPLICATION_STATUS_NOTIFICATION_TYPE } = await import(
  '../constants/notificationTypes.js'
);

// Realistic distribution across a run of applications: mostly applied/under
// review, a meaningful shortlist, a few selected, some rejected.
const STATUS_WEIGHTS = [
  ['applied', 34],
  ['under_review', 22],
  ['shortlisted', 18],
  ['rejected', 16],
  ['selected', 10],
];

function pickWeightedStatus(random) {
  const total = STATUS_WEIGHTS.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [status, weight] of STATUS_WEIGHTS) {
    if (roll < weight) return status;
    roll -= weight;
  }
  return 'applied';
}

// Deterministic PRNG (mulberry32) so re-running with the same DB state
// produces the same distribution rather than a different random one.
function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(array, random) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const TARGET_APPLICATION_COUNT = 90;
const MAX_APPLICATIONS_PER_STUDENT = 6;

async function run() {
  await db.sequelize.authenticate();
  const random = mulberry32(20260817);

  const beforeCount = await db.Application.count();

  if (beforeCount >= TARGET_APPLICATION_COUNT) {
    console.log('--- Application seed report ---');
    console.log(`Applications before: ${beforeCount}`);
    console.log(`Already at or above the ${TARGET_APPLICATION_COUNT} target — nothing to add.`);
    await db.sequelize.close();
    return;
  }

  const studentProfiles = await db.StudentProfile.findAll({
    include: [{ model: db.User, attributes: ['userId', 'fullName'] }],
  });
  const openJobs = await db.Job.findAll({
    where: { status: 'open' },
    include: [{ model: db.Company, attributes: ['name'] }],
  });

  const eligibleStudents = studentProfiles.filter((profile) => profile.currentResumeId);

  if (!eligibleStudents.length || !openJobs.length) {
    console.log('No eligible students (with a current resume) or open jobs found — nothing to seed.');
    await db.sequelize.close();
    return;
  }

  const shuffledStudents = shuffle(eligibleStudents, random);

  const remainingTarget = TARGET_APPLICATION_COUNT - beforeCount;
  let added = 0;
  let skipped = 0;
  let attempts = 0;

  for (const profile of shuffledStudents) {
    const perStudentTarget = 2 + Math.floor(random() * (MAX_APPLICATIONS_PER_STUDENT - 1));
    const candidateJobs = shuffle(openJobs, random).slice(0, perStudentTarget);

    for (const job of candidateJobs) {
      if (added >= remainingTarget) break;
      attempts += 1;

      const existing = await db.Application.findOne({
        where: { jobId: job.jobId, studentProfileId: profile.studentProfileId },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      const status = pickWeightedStatus(random);
      // Spread applied_at over the past ~45 days so ordering/reports look
      // realistic; deadlines on open jobs are all in the future (seedJobs.js),
      // so any past applied_at is guaranteed to be before the deadline.
      const daysAgo = 1 + Math.floor(random() * 45);
      const appliedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      await db.sequelize.transaction(async (transaction) => {
        const application = await db.Application.create(
          {
            jobId: job.jobId,
            studentProfileId: profile.studentProfileId,
            resumeId: profile.currentResumeId,
            status,
            createdAt: appliedAt,
            updatedAt: appliedAt,
          },
          { transaction, silent: true }
        );

        const companyName = job.Company?.name ?? 'the company';
        const studentName = profile.User?.fullName ?? 'A student';

        await db.Notification.create(
          {
            userId: profile.User.userId,
            type: NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
            title: 'Application submitted',
            message: `Your application for ${job.title} at ${companyName} was submitted successfully.`,
            relatedEntityType: RELATED_ENTITY_TYPES.APPLICATION,
            relatedEntityId: application.applicationId,
            createdAt: appliedAt,
            updatedAt: appliedAt,
          },
          { transaction, silent: true }
        );

        await db.Notification.create(
          {
            userId: job.postedBy,
            type: NOTIFICATION_TYPES.NEW_APPLICATION,
            title: 'New application',
            message: `${studentName} applied for ${job.title}.`,
            relatedEntityType: RELATED_ENTITY_TYPES.APPLICATION,
            relatedEntityId: application.applicationId,
            createdAt: appliedAt,
            updatedAt: appliedAt,
          },
          { transaction, silent: true }
        );

        if (status !== 'applied') {
          const notificationType = APPLICATION_STATUS_NOTIFICATION_TYPE[status];
          const statusChangedAt = new Date(appliedAt.getTime() + (1 + Math.floor(random() * 5)) * 24 * 60 * 60 * 1000);
          const message =
            status === 'selected'
              ? `Congratulations! Your application for ${job.title} at ${companyName} has been selected.`
              : `Your application for ${job.title} at ${companyName} has been ${status.replace('_', ' ')}.`;

          await db.Notification.create(
            {
              userId: profile.User.userId,
              type: notificationType,
              title: `Application ${status.replace('_', ' ')}`,
              message,
              relatedEntityType: RELATED_ENTITY_TYPES.APPLICATION,
              relatedEntityId: application.applicationId,
              createdAt: statusChangedAt,
              updatedAt: statusChangedAt,
            },
            { transaction, silent: true }
          );
        }
      });

      added += 1;
    }

    if (added >= remainingTarget) break;
  }

  const afterCount = await db.Application.count();
  const statusCounts = await db.Application.findAll({
    attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('application_id')), 'count']],
    group: ['status'],
    raw: true,
  });

  console.log('--- Application seed report ---');
  console.log(`Applications before: ${beforeCount}`);
  console.log(`Applications added:  ${added}`);
  console.log(`Skipped (duplicate pair): ${skipped}`);
  console.log(`Attempts: ${attempts}`);
  console.log(`Applications after:  ${afterCount}`);
  console.log('Status distribution:', JSON.stringify(statusCounts));

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Application seed failed:', error);
  process.exit(1);
});
