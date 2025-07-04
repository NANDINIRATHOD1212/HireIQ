// models/AssessmentResult.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AssessmentResult = sequelize.define('AssessmentResult', {
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionSetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
  type: DataTypes.STRING,
  defaultValue: 'Pending', 
}
});

export default AssessmentResult;
