// models/Assessment.js
const Assessment = sequelize.define('Assessment', {
    candidateId: DataTypes.INTEGER,
    questionSetId: DataTypes.INTEGER,
    answers: DataTypes.JSON, // [{"question": "...", "givenAnswer": "...", "correctAnswer": "...", "isCorrect": true}]
    score: DataTypes.FLOAT
  });
  