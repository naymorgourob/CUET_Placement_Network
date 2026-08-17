// Dev/demo seed: populates a realistic student population (User + StudentProfile)
// so the platform has a real applicant pool to demo against. Idempotent —
// keyed on email, safe to run multiple times. Uses the same bcrypt hashing
// as real registration (auth.service.js), never plaintext passwords.
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { students } = await import('./data/students.data.js');

const SEED_PASSWORD = 'password123';
const SALT_ROUNDS = 10;

async function run() {
  await db.sequelize.authenticate();

  const beforeCount = await db.User.count({ where: { role: 'student' } });
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  let added = 0;
  let skipped = 0;

  for (const entry of students) {
    const existingUser = await db.User.findOne({ where: { email: entry.email } });

    if (existingUser) {
      skipped += 1;
      continue;
    }

    await db.sequelize.transaction(async (transaction) => {
      const user = await db.User.create(
        {
          fullName: entry.fullName,
          email: entry.email,
          passwordHash,
          role: 'student',
          isActive: true,
        },
        { transaction }
      );

      await db.StudentProfile.create(
        {
          userId: user.userId,
          department: entry.department,
          batchYear: entry.batchYear,
          cgpa: entry.cgpa,
          phone: entry.phone,
          skills: entry.skills,
        },
        { transaction }
      );
    });

    added += 1;
  }

  const afterCount = await db.User.count({ where: { role: 'student' } });

  console.log('--- Student seed report ---');
  console.log(`Students before: ${beforeCount}`);
  console.log(`Students added:  ${added}`);
  console.log(`Students skipped (already existed): ${skipped}`);
  console.log(`Students after:  ${afterCount}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Student seed failed:', error);
  process.exit(1);
});
