import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recruiterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  venue:{
     type: DataTypes.STRING,
    allowNull: false,
  }
});
export default Interview;