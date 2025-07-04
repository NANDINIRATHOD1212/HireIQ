import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  recruiterId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skillsRequired: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW  
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open' 
  }
}, {
  timestamps: true
});

export default Job;
