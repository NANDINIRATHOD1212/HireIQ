// models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

import QuestionSet from './QuestionSet.js';

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add models to db object
db.QuestionSet = QuestionSet;

export default db;
