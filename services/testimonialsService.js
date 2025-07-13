import { Testimonial, User } from '../db/index.js';

export const getTestimonials = async () => {
  return Testimonial.findAll({
    attributes: ['id', 'testimonial'],
    include: {
      model: User,
      as: 'user',
      attributes: ['name'],
    },
  });
};
