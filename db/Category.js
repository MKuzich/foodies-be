import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Category = sequelize.define('category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Category.sync();

export default Category;
