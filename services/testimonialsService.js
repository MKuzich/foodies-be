import Testimonial from '../db/Testimonial.js';

export const allTestimonials = async () => {
  return Testimonial.findAll({
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name'],
    }
  });
};
