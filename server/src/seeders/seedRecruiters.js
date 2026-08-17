// Dev/demo seed: populates one recruiter account per existing company (User +
// RecruiterProfile), matching the real registration + admin verification
// flows exactly (admin.service.js verifyRecruiter/rejectRecruiter) rather
// than inventing new states. Idempotent — keyed on email. Requires
// seedCompanies.js to have already run; does not create companies.
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { recruiters } = await import('./data/recruiters.data.js');
const { NOTIFICATION_TYPES, RELATED_ENTITY_TYPES } = await import('../constants/notificationTypes.js');

const SEED_PASSWORD = 'password123';
const SALT_ROUNDS = 10;

async function run() {
  await db.sequelize.authenticate();

  const admin = await db.User.findOne({ where: { role: 'admin' } });
  if (!admin) {
    throw new Error('No admin account found. This seed reuses an existing admin as the verifier and does not create one.');
  }

  const beforeCount = await db.User.count({ where: { role: 'recruiter' } });
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  let added = 0;
  let skipped = 0;
  let companiesNotFound = 0;

  for (const entry of recruiters) {
    const existingUser = await db.User.findOne({ where: { email: entry.email } });

    if (existingUser) {
      skipped += 1;
      continue;
    }

    const company = await db.Company.findOne({ where: { name: entry.companyName } });

    if (!company) {
      console.warn(`Skipping "${entry.email}" — no company named "${entry.companyName}" found.`);
      companiesNotFound += 1;
      continue;
    }

    await db.sequelize.transaction(async (transaction) => {
      const user = await db.User.create(
        {
          fullName: entry.fullName,
          email: entry.email,
          passwordHash,
          role: 'recruiter',
          isActive: true,
        },
        { transaction }
      );

      const isVerified = entry.status === 'verified';
      const isDecided = entry.status === 'verified' || entry.status === 'rejected';

      const profile = await db.RecruiterProfile.create(
        {
          userId: user.userId,
          companyId: company.companyId,
          designation: entry.designation,
          phone: entry.phone,
          isVerified,
          verifiedAt: isVerified ? new Date() : null,
          verifiedBy: isDecided ? admin.userId : null,
        },
        { transaction }
      );

      if (isVerified) {
        await db.Notification.create(
          {
            userId: user.userId,
            type: NOTIFICATION_TYPES.RECRUITER_VERIFIED,
            title: 'Recruiter account verified',
            message: 'Your recruiter account has been verified.',
            relatedEntityType: RELATED_ENTITY_TYPES.RECRUITER,
            relatedEntityId: profile.recruiterProfileId,
          },
          { transaction }
        );
      } else if (entry.status === 'rejected') {
        await db.Notification.create(
          {
            userId: user.userId,
            type: NOTIFICATION_TYPES.RECRUITER_REJECTED,
            title: 'Recruiter verification rejected',
            message: 'Your recruiter account verification was rejected.',
            relatedEntityType: RELATED_ENTITY_TYPES.RECRUITER,
            relatedEntityId: profile.recruiterProfileId,
          },
          { transaction }
        );
      } else {
        await db.Notification.create(
          {
            userId: admin.userId,
            type: NOTIFICATION_TYPES.NEW_RECRUITER_REGISTRATION,
            title: 'New recruiter registration',
            message: `${user.fullName} registered as a recruiter and is awaiting verification.`,
            relatedEntityType: RELATED_ENTITY_TYPES.RECRUITER,
            relatedEntityId: user.userId,
          },
          { transaction }
        );
      }
    });

    added += 1;
  }

  const afterCount = await db.User.count({ where: { role: 'recruiter' } });

  console.log('--- Recruiter seed report ---');
  console.log(`Recruiters before: ${beforeCount}`);
  console.log(`Recruiters added:  ${added}`);
  console.log(`Recruiters skipped (already existed): ${skipped}`);
  console.log(`Companies referenced but not found: ${companiesNotFound}`);
  console.log(`Recruiters after:  ${afterCount}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Recruiter seed failed:', error);
  process.exit(1);
});
