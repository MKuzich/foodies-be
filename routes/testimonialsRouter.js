import express from 'express';
import controllers from '../controllers/testimonialsController.js';

const testimonialRouter = express.Router();

testimonialRouter.get('/', controllers.getTestimonials);

export default testimonialRouter;
