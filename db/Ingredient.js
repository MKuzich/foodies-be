import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Ingredient = sequelize.define('ingredient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Ingredient.sync();

export default Ingredient;
