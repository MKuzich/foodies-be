import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Follow = sequelize.define(
  'follow',
  {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'follows',
    timestamps: false,
  }
);

// Follow.sync({alter: true});

export default Follow;
