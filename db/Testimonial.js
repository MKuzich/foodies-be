import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Testimonial = sequelize.define('testimonial', {
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Testimonial.sync();

export default Testimonial;
