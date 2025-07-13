import * as testimonialsService from '../services/testimonialsService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

export const getTestimonials = async (req, res) => {
  const result = await testimonialsService.getTestimonials();
  const testimonials = result.map(({ id, testimonial, user }) => ({
    id,
    testimonial,
    ownerName: user.name,
  }));
  res.json(testimonials);
};

export default {
  getTestimonials: ctrlWrapper(getTestimonials),
};
