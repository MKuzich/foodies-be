import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const UserFavorite = sequelize.define(
  'UserFavorite',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: 'user_favorites',
    timestamps: false,
  }
);

export default UserFavorite;
