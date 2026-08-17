import { Op } from 'sequelize';
import path from 'path';
import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_PATH || 'uploads');

// filePath is always stored relative to UPLOAD_ROOT (e.g. "companies/foo.png"),
// matching the convention used for resumes (Resume.filePath), so the frontend
// can build a file URL the same way everywhere: `${uploadBaseUrl}/${filePath}`.
function toRelativeUploadPath(absoluteOrRelativePath) {
  const absolute = path.resolve(absoluteOrRelativePath);
  return path.relative(UPLOAD_ROOT, absolute).split(path.sep).join('/');
}

export async function listCompanies(query) {
  const { search, industry, page = 1, limit = 20 } = query;

  const where = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  if (industry) {
    where.industry = { [Op.like]: `%${industry}%` };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Company.findAndCountAll({
    where,
    order: [['name', 'ASC']],
    limit: limitNumber,
    offset,
  });

  const openJobCounts = await db.Job.findAll({
    attributes: ['companyId', [db.sequelize.fn('COUNT', db.sequelize.col('job_id')), 'openJobCount']],
    where: { companyId: rows.map((company) => company.companyId), status: 'open' },
    group: ['companyId'],
    raw: true,
  });

  const openJobCountByCompanyId = new Map(
    openJobCounts.map((row) => [row.companyId, Number(row.openJobCount)])
  );

  const companies = rows.map((company) => ({
    ...company.toJSON(),
    openJobCount: openJobCountByCompanyId.get(company.companyId) ?? 0,
  }));

  return {
    companies,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function getCompanyById(companyId) {
  const company = await db.Company.findByPk(companyId);

  if (!company) {
    throw new AppError(404, 'Company not found.');
  }

  const openJobCount = await db.Job.count({ where: { companyId, status: 'open' } });

  return { ...company.toJSON(), openJobCount };
}

async function getRecruiterProfileByUserId(userId) {
  const profile = await db.RecruiterProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Recruiter profile not found.');
  }

  return profile;
}

export async function getCompany(userId) {
  const recruiterProfile = await getRecruiterProfileByUserId(userId);

  if (!recruiterProfile.companyId) {
    throw new AppError(404, 'Company profile not yet created.');
  }

  return db.Company.findByPk(recruiterProfile.companyId);
}

export async function createOrUpdateCompany(userId, updates) {
  const { name, industry, website, description } = updates;

  return db.sequelize.transaction(async (transaction) => {
    const recruiterProfile = await db.RecruiterProfile.findOne({
      where: { userId },
      transaction,
    });

    if (!recruiterProfile) {
      throw new AppError(404, 'Recruiter profile not found.');
    }

    if (recruiterProfile.companyId) {
      const company = await db.Company.findByPk(recruiterProfile.companyId, { transaction });

      await company.update(
        {
          ...(name !== undefined && { name }),
          ...(industry !== undefined && { industry }),
          ...(website !== undefined && { website }),
          ...(description !== undefined && { description }),
        },
        { transaction }
      );

      return company;
    }

    const company = await db.Company.create(
      { name, industry, website, description },
      { transaction }
    );

    await recruiterProfile.update({ companyId: company.companyId }, { transaction });

    return company;
  });
}

export async function updateCompanyLogo(userId, file) {
  const recruiterProfile = await getRecruiterProfileByUserId(userId);

  if (!recruiterProfile.companyId) {
    throw new AppError(404, 'Company profile not yet created.');
  }

  const company = await db.Company.findByPk(recruiterProfile.companyId);

  await company.update({ logoPath: toRelativeUploadPath(file.path) });

  return company;
}
