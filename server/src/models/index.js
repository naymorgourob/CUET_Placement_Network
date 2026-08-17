import sequelize from '../config/db.js';

import User from './user.model.js';
import StudentProfile from './studentProfile.model.js';
import RecruiterProfile from './recruiterProfile.model.js';
import Company from './company.model.js';
import Resume from './resume.model.js';
import ResumeAnalysis from './resumeAnalysis.model.js';
import Job from './job.model.js';
import Application from './application.model.js';
import MatchScore from './matchScore.model.js';
import Notification from './notification.model.js';
import Resource from './resource.model.js';
import SavedJob from './savedJob.model.js';

const db = {};

db.sequelize = sequelize;
db.User = User;
db.StudentProfile = StudentProfile;
db.RecruiterProfile = RecruiterProfile;
db.Company = Company;
db.Resume = Resume;
db.ResumeAnalysis = ResumeAnalysis;
db.Job = Job;
db.Application = Application;
db.MatchScore = MatchScore;
db.Notification = Notification;
db.Resource = Resource;
db.SavedJob = SavedJob;

// User <-> StudentProfile (1:1)
User.hasOne(StudentProfile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
StudentProfile.belongsTo(User, {
  foreignKey: 'userId',
});

// User <-> RecruiterProfile (1:1)
User.hasOne(RecruiterProfile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
RecruiterProfile.belongsTo(User, {
  foreignKey: 'userId',
});

// User (Admin) -> RecruiterProfile (1:N, verification audit trail)
User.hasMany(RecruiterProfile, {
  foreignKey: 'verifiedBy',
  as: 'verifiedRecruiters',
  onDelete: 'SET NULL',
});
RecruiterProfile.belongsTo(User, {
  foreignKey: 'verifiedBy',
  as: 'verifier',
});

// Company <-> RecruiterProfile (1:N)
Company.hasMany(RecruiterProfile, {
  foreignKey: 'companyId',
  onDelete: 'RESTRICT',
});
RecruiterProfile.belongsTo(Company, {
  foreignKey: 'companyId',
});

// Company <-> Job (1:N)
Company.hasMany(Job, {
  foreignKey: 'companyId',
  onDelete: 'RESTRICT',
});
Job.belongsTo(Company, {
  foreignKey: 'companyId',
});

// User (Recruiter) <-> Job (1:N, posted_by)
User.hasMany(Job, {
  foreignKey: 'postedBy',
  as: 'postedJobs',
  onDelete: 'RESTRICT',
});
Job.belongsTo(User, {
  foreignKey: 'postedBy',
  as: 'poster',
});

// StudentProfile <-> Resume (1:N)
StudentProfile.hasMany(Resume, {
  foreignKey: 'studentProfileId',
  onDelete: 'CASCADE',
});
Resume.belongsTo(StudentProfile, {
  foreignKey: 'studentProfileId',
});

// StudentProfile <-> Resume (current resume reference, 1:1-ish pointer)
StudentProfile.belongsTo(Resume, {
  foreignKey: 'currentResumeId',
  as: 'currentResume',
});

// Resume <-> ResumeAnalysis (1:1)
Resume.hasOne(ResumeAnalysis, {
  foreignKey: 'resumeId',
  onDelete: 'CASCADE',
});
ResumeAnalysis.belongsTo(Resume, {
  foreignKey: 'resumeId',
});

// StudentProfile <-> Application (1:N)
StudentProfile.hasMany(Application, {
  foreignKey: 'studentProfileId',
});
Application.belongsTo(StudentProfile, {
  foreignKey: 'studentProfileId',
});

// Job <-> Application (1:N)
Job.hasMany(Application, {
  foreignKey: 'jobId',
  onDelete: 'CASCADE',
});
Application.belongsTo(Job, {
  foreignKey: 'jobId',
});

// Resume <-> Application (1:N)
Resume.hasMany(Application, {
  foreignKey: 'resumeId',
  onDelete: 'RESTRICT',
});
Application.belongsTo(Resume, {
  foreignKey: 'resumeId',
});

// Resume <-> MatchScore (1:N)
Resume.hasMany(MatchScore, {
  foreignKey: 'resumeId',
});
MatchScore.belongsTo(Resume, {
  foreignKey: 'resumeId',
});

// Job <-> MatchScore (1:N)
Job.hasMany(MatchScore, {
  foreignKey: 'jobId',
  onDelete: 'CASCADE',
});
MatchScore.belongsTo(Job, {
  foreignKey: 'jobId',
});

// User <-> Notification (1:N)
User.hasMany(Notification, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Notification.belongsTo(User, {
  foreignKey: 'userId',
});

// StudentProfile <-> SavedJob (1:N)
StudentProfile.hasMany(SavedJob, {
  foreignKey: 'studentProfileId',
  onDelete: 'CASCADE',
});
SavedJob.belongsTo(StudentProfile, {
  foreignKey: 'studentProfileId',
});

// Job <-> SavedJob (1:N)
Job.hasMany(SavedJob, {
  foreignKey: 'jobId',
  onDelete: 'CASCADE',
});
SavedJob.belongsTo(Job, {
  foreignKey: 'jobId',
});

// User (Admin) <-> Resource (1:N, authoring)
User.hasMany(Resource, {
  foreignKey: 'createdBy',
  as: 'createdResources',
  onDelete: 'RESTRICT',
});
Resource.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator',
});

// Note: Resume <-> Job is conceptually many-to-many, resolved through MatchScore.
// The hasMany/belongsTo pairs above (Resume <-> MatchScore, Job <-> MatchScore)
// already express this relationship. A belongsToMany was intentionally omitted:
// Sequelize's belongsToMany generates its own implicit unique index on the
// junction table, which duplicated the explicit UNIQUE(resume_id, job_id)
// index already defined on MatchScore — confirmed by syncing against a real
// database during verification. The explicit hasMany/belongsTo pairs are
// sufficient to query and traverse the relationship in both directions.

export default db;
