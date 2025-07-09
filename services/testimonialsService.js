import Testimonial from '../db/Testimonial.js';

export const allTestimonials = async () => {
  return Testimonial.findAll();
};
