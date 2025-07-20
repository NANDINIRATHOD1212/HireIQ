import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize,{connectDB}from '../config/db.js';
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true
  }
},
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'recruiter', 'candidate'),
    defaultValue: 'candidate',
  },
isVerified: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
},
otp: {
  type: DataTypes.STRING,
  allowNull: true
},
otpExpiry: {
  type: DataTypes.DATE,
  allowNull: true
}
,resetOtp: {
  type: DataTypes.STRING,
  allowNull: true
},
googleId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true,
},

  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // models/User.js
company: { type: DataTypes.STRING },
location: { type: DataTypes.STRING },
bio: { type: DataTypes.TEXT },


}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }}
  }
});

export default User;
