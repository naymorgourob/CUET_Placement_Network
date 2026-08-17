import { Op } from 'sequelize';
import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';

const LIST_ATTRIBUTES = [
  'resourceId',
  'title',
  'slug',
  'category',
  'excerpt',
  'coverImagePath',
  'author',
  'tags',
  'readingTimeMinutes',
  'isFeatured',
  'publishedAt',
  'createdAt',
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(title, excludeResourceId) {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (true) {
    const where = { slug };
    if (excludeResourceId) {
      where.resourceId = { [Op.ne]: excludeResourceId };
    }
    const existing = await db.Resource.findOne({ where });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function listPublishedResources(query) {
  const { search, category, page = 1, limit = 12 } = query;

  const where = { status: 'published' };

  if (category) {
    where.category = category;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
      { tags: { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Resource.findAndCountAll({
    where,
    attributes: LIST_ATTRIBUTES,
    order: [['publishedAt', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    resources: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function getFeaturedResource() {
  return db.Resource.findOne({
    where: { status: 'published', isFeatured: true },
    attributes: LIST_ATTRIBUTES,
    order: [['publishedAt', 'DESC']],
  });
}

export async function getPublishedResourceBySlug(slug) {
  const resource = await db.Resource.findOne({ where: { slug, status: 'published' } });

  if (!resource) {
    throw new AppError(404, 'Resource not found.');
  }

  return resource;
}

export async function getRelatedResources(resource, limitCount = 3) {
  const tagList = (resource.tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const tagConditions = tagList.map((tag) => ({ tags: { [Op.like]: `%${tag}%` } }));

  return db.Resource.findAll({
    where: {
      status: 'published',
      resourceId: { [Op.ne]: resource.resourceId },
      [Op.or]: [{ category: resource.category }, ...tagConditions],
    },
    attributes: LIST_ATTRIBUTES,
    order: [['publishedAt', 'DESC']],
    limit: limitCount,
  });
}

// --- Admin management ---

export async function listAllResources(query) {
  const { search, category, status, page = 1, limit = 20 } = query;

  const where = {};

  if (category) where.category = category;
  if (status) where.status = status;

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Resource.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    resources: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function getResourceById(resourceId) {
  const resource = await db.Resource.findByPk(resourceId);

  if (!resource) {
    throw new AppError(404, 'Resource not found.');
  }

  return resource;
}

export async function createResource(adminUserId, data) {
  const { title, category, excerpt, content, coverImagePath, author, tags, readingTimeMinutes, isFeatured, status } =
    data;

  const slug = await generateUniqueSlug(title);
  const willPublish = status === 'published';

  return db.Resource.create({
    title,
    slug,
    category,
    excerpt,
    content,
    coverImagePath: coverImagePath || null,
    author: author || undefined,
    tags: tags || null,
    readingTimeMinutes: readingTimeMinutes ?? null,
    isFeatured: Boolean(isFeatured),
    status: status || 'draft',
    publishedAt: willPublish ? new Date() : null,
    createdBy: adminUserId,
  });
}

export async function updateResource(resourceId, data) {
  const resource = await getResourceById(resourceId);

  const { title, category, excerpt, content, coverImagePath, author, tags, readingTimeMinutes, isFeatured, status } =
    data;

  const updates = {
    ...(category !== undefined && { category }),
    ...(excerpt !== undefined && { excerpt }),
    ...(content !== undefined && { content }),
    ...(coverImagePath !== undefined && { coverImagePath: coverImagePath || null }),
    ...(author !== undefined && { author }),
    ...(tags !== undefined && { tags: tags || null }),
    ...(readingTimeMinutes !== undefined && { readingTimeMinutes }),
    ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
  };

  if (title !== undefined && title !== resource.title) {
    updates.title = title;
    updates.slug = await generateUniqueSlug(title, resource.resourceId);
  }

  if (status !== undefined && status !== resource.status) {
    updates.status = status;
    if (status === 'published' && !resource.publishedAt) {
      updates.publishedAt = new Date();
    }
  }

  await resource.update(updates);

  return resource;
}

export async function deleteResource(resourceId) {
  const resource = await getResourceById(resourceId);
  await resource.destroy();
  return { resourceId: resource.resourceId };
}
