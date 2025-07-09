import * as testimonialsService from '../services/testimonialsService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

export const getTestimonials = async (req, res) => {
  result = await testimonialsService.allTestimonials();
  res.json(result);
};

export default {
  getTestimonials: ctrlWrapper(getTestimonials),
};
