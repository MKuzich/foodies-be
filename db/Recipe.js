import { DataTypes } from 'sequelize';

import sequelize from './sequelize.js';

const Recipe = sequelize.define('recipe', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  category: DataTypes.STRING,
  owner: DataTypes.STRING,
  area: DataTypes.STRING,
  title: DataTypes.STRING,
  instructions: DataTypes.TEXT('long'),
  description: DataTypes.TEXT,
  thumb: DataTypes.STRING,
  time: DataTypes.STRING,
});

// Recipe.sync({ alter: true });

export default Recipe;
