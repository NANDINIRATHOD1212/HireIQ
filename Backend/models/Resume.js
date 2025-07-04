// models/Resume.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // make sure this points to your Sequelize instance

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique :true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  extractedData: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Resume;
