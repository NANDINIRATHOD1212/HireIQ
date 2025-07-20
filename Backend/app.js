import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import './controllers/googlestrategy.js';

import { connectDB } from './config/db.js';
import sequelize from './config/db.js';

import User from './models/User.js';
import Resume from './models/Resume.js';
import AssessmentResult from './models/AssessmentResult.js';
import Job from './models/Job.js';
import JobApplication from './models/JobApplication.js';
import QuestionSet from './models/QuestionSet.js';
import Interview from './models/Interview.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import candidateAssessementRoutes from './routes/candidateAssessmentRoutes.js';

const app = express();


app.use(cors({
  origin: 'https://hireiq-frontend-v9nq.onrender.com',
  credentials: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoutes);
app.use('/', adminRoutes);
app.use('/', recruiterRoutes);
app.use('/recruiter', questionRoutes);
app.use('/', dashboardRoutes);
app.use('/', resumeRoutes);
app.use('/', candidateRoutes);
app.use('/', candidateAssessementRoutes);
app.use('/uploads', express.static('uploads'));



User.hasOne(Resume, { foreignKey: 'userId', as: 'resume' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'resume' });


User.hasMany(Job, { foreignKey: 'recruiterId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });


User.hasMany(JobApplication, { foreignKey: 'candidateId', as: 'applications' });
JobApplication.belongsTo(User, { foreignKey: 'candidateId', as: 'candidate' });
Job.hasMany(JobApplication, { foreignKey: 'jobId', as: 'applications' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId', as: 'appliedJob' });

QuestionSet.belongsTo(User, { foreignKey: 'recruiterId' });
User.hasMany(QuestionSet, { foreignKey: 'recruiterId' });

QuestionSet.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(QuestionSet, { foreignKey: 'jobId' });

QuestionSet.hasMany(AssessmentResult, { foreignKey: 'questionSetId' });
AssessmentResult.belongsTo(QuestionSet, { foreignKey: 'questionSetId' });
User.hasMany(AssessmentResult, { foreignKey: 'candidateId' });
AssessmentResult.belongsTo(User, { foreignKey: 'candidateId' });

User.hasMany(Interview, { foreignKey: 'candidateId', as: 'candidateInterviews' });
Interview.belongsTo(User, { foreignKey: 'candidateId', as: 'candidate' });

User.hasMany(Interview, { foreignKey: 'recruiterId', as: 'recruiterInterviews' });
Interview.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });




const startApp = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log(' All models synced!');
    app.listen(3000, () => console.log(' Server running at http://localhost:3000'));
  } catch (err) {
    console.error(' Error starting server:', err);
  }
};

startApp();
