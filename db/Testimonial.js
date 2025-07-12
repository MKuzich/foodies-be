import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './User.js';
import Recipe from './Recipe.js';

const Testimonial = sequelize.define('testimonial', {
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Recipe,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Testimonial.sync();

export default Testimonial;
