// Dev/demo seed: populates the Company directory with real, publicly known
// companies so the frontend has realistic data during development. Idempotent —
// safe to run multiple times. Does not create jobs, applications, students,
// or recruiters, and never touches a company that already exists by name.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { companies } = await import('./data/companies.data.js');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  await db.sequelize.authenticate();

  const beforeCount = await db.Company.count();

  let added = 0;
  let skipped = 0;

  for (const entry of companies) {
    const { logoDomain, ...companyFields } = entry;
    const logoPath = `companies/${slugify(entry.name)}.png`;

    const [, created] = await db.Company.findOrCreate({
      where: { name: entry.name },
      defaults: {
        industry: companyFields.industry,
        website: companyFields.website,
        description: companyFields.description,
        logoPath,
      },
    });

    if (created) {
      added += 1;
    } else {
      skipped += 1;
    }
  }

  const afterCount = await db.Company.count();

  console.log('--- Company seed report ---');
  console.log(`Companies before:  ${beforeCount}`);
  console.log(`Companies added:   ${added}`);
  console.log(`Companies skipped (already existed): ${skipped}`);
  console.log(`Companies after:   ${afterCount}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Company seed failed:', error);
  process.exit(1);
});
