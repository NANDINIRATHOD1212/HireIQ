import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Job from './Job.js';

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Applied' // or: Shortlisted, Interview Scheduled, Rejected, etc.
  }
});
JobApplication.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

export default JobApplication;
