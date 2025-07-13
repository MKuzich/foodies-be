import { Testimonial } from '../db/index.js';
import { getSeeder } from './utils.js';

export const seedTestimonials = getSeeder('testimonials.json', Testimonial);
