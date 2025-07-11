import Testimonial from '../db/Testimonial.js';
import { getSeeder } from './utils.js';

export const seedTestimonials = getSeeder('testimonials.json', Testimonial);
