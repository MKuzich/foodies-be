import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Testimonial = sequelize.define('testimonial', {
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipes',
      key: 'id',
    },
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Testimonial.sync({ force: true });

export default Testimonial;
