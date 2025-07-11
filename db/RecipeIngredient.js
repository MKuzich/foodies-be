import { DataTypes } from 'sequelize';

import sequelize from './sequelize.js';

const RecipeIngredient = sequelize.define('recipe-ingredient', {
  measure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default RecipeIngredient;
