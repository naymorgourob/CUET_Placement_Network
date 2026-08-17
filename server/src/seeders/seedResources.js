// Dev/demo seed: populates the Resources (career hub) table with original,
// published articles. Idempotent — keyed on slug. Does not delete or
// overwrite any existing resource, and does not create new user accounts;
// all seeded resources are attributed to an existing admin account.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: db } = await import('../models/index.js');
const { resources } = await import('./data/resources.data.js');

const SEED_ADMIN_EMAIL = 'admin.f1@example.com';
const DAY = 24 * 60 * 60 * 1000;

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function publishedDateForIndex(index) {
  // Stagger publish dates over the past several weeks so "latest resources"
  // ordering looks realistic instead of everything sharing one timestamp.
  const daysAgo = (resources.length - index) * 3;
  return new Date(Date.now() - daysAgo * DAY);
}

async function run() {
  await db.sequelize.authenticate();

  const admin = await db.User.findOne({ where: { email: SEED_ADMIN_EMAIL, role: 'admin' } });

  if (!admin) {
    throw new Error(
      `Seed admin account (${SEED_ADMIN_EMAIL}) not found. This seed reuses an existing admin as the resource author and does not create new accounts.`
    );
  }

  const beforeCount = await db.Resource.count();

  let added = 0;
  let skipped = 0;

  for (const [index, entry] of resources.entries()) {
    const slug = slugify(entry.title);

    const [, created] = await db.Resource.findOrCreate({
      where: { slug },
      defaults: {
        title: entry.title,
        category: entry.category,
        excerpt: entry.excerpt,
        content: entry.content,
        coverImagePath: null,
        author: 'CUET Placement Network',
        tags: entry.tags ?? null,
        readingTimeMinutes: entry.readingTimeMinutes ?? null,
        isFeatured: Boolean(entry.isFeatured),
        status: 'published',
        publishedAt: publishedDateForIndex(index),
        createdBy: admin.userId,
      },
    });

    if (created) {
      added += 1;
    } else {
      skipped += 1;
    }
  }

  const afterCount = await db.Resource.count();

  console.log('--- Resource seed report ---');
  console.log(`Resources before: ${beforeCount}`);
  console.log(`Resources added:  ${added}`);
  console.log(`Resources skipped (already existed): ${skipped}`);
  console.log(`Resources after:  ${afterCount}`);

  await db.sequelize.close();
}

run().catch((error) => {
  console.error('Resource seed failed:', error);
  process.exit(1);
});
