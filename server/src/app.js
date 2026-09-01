import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import recruiterRoutes from './routes/recruiter.routes.js';
import companyRoutes from './routes/company.routes.js';
import companiesRoutes from './routes/companies.routes.js';
import jobRoutes from './routes/job.routes.js';
import recruiterJobsRoutes from './routes/recruiterJobs.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import jobApplicationsRoutes from './routes/jobApplications.routes.js';
import studentApplicationsRoutes from './routes/studentApplications.routes.js';
import savedJobRoutes from './routes/savedJob.routes.js';
import applicationRoutes from './routes/application.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';

const app = express();

const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_PATH || 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/students/me', studentApplicationsRoutes);
app.use('/api/students/me/saved-jobs', savedJobRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/recruiters/me', recruiterJobsRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/jobs/:jobId', jobApplicationsRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/resources', resourcesRoutes);

app.use(notFound);
app.use(errorHandler);

export async function connectDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('✓ Database Connected');

    await db.sequelize.sync();
    console.log('✓ Models Synced');
  } catch (error) {
    console.error('✗ Database connection failed:', error.original?.code || error.message || error.name);
    process.exit(1);
  }
}

export default app;
