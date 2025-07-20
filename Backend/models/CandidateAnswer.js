import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CandidateAnswer = sequelize.define('CandidateAnswer', {
  questionSetId: DataTypes.INTEGER,
  candidateId: DataTypes.INTEGER,
  question: DataTypes.STRING,
  answer: DataTypes.TEXT,
});

export default CandidateAnswer;
