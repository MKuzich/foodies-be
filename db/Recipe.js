import { DataTypes } from 'sequelize';

import sequelize from './sequelize.js';

const Recipe = sequelize.define('recipe', {
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  areaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: DataTypes.STRING,
  instructions: DataTypes.TEXT('long'),
  description: DataTypes.TEXT,
  thumb: DataTypes.STRING,
  time: DataTypes.STRING,
});

// Recipe.sync({ alter: true });

export default Recipe;
