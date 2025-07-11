import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Follow = sequelize.define(
  'follow',
  {
    followerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      primaryKey: true,
    },
    followingId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    tableName: 'follows',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['followerId', 'followingId'],
      },
    ],
  }
);

// Follow.sync({alter: true});

export default Follow;
