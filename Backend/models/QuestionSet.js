import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const QuestionSet = sequelize.define('QuestionSet', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  recruiterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jobId: {                     // ✅ ADD THIS LINE
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

export default QuestionSet;
