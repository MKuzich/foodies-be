import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Testimonial = sequelize.define('testimonial', {
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Testimonial.sync();

export default Testimonial;
