import express from 'express';
import controllers from '../controllers/testimonialsController.js';

const testimonialRouter = express.Router();

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Get list of user testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   message:
 *                     type: string
 *                   avatarURL:
 *                     type: string
 *       500:
 *         description: Server error
 */
testimonialRouter.get('/', controllers.getTestimonials);

export default testimonialRouter;
