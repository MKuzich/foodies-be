import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import { emailRegexp } from '../constants/user.js';

const User = sequelize.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: emailRegexp,
      },
      unique: {
        args: true,
        msg: 'Email in use',
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    avatarURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
  }
);

User.prototype.toPublicJSON = function () {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    avatarURL: this.avatarURL,
  };
};

// User.sync({alter: true});

export default User;
