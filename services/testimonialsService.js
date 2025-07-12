import Testimonial from '../db/Testimonial.js';
// import User from '../db/User.js';

export const allTestimonials = async () => {
  return Testimonial.findAll();
  //   {
  //   include: {
  //     model: User,
  //     as: 'user',
  //     attributes: ['id', 'name'],
  //   },
  // }
};
