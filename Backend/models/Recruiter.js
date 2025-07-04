// models/Recruiter.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Recruiter = sequelize.define("Recruiter", {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  phone: DataTypes.STRING,
  company: DataTypes.STRING,
  designation: DataTypes.STRING,
  location: DataTypes.STRING,
  linkedin: DataTypes.STRING
});

export default Recruiter;

