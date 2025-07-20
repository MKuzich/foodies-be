import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import { testimonialSchema } from '../schemas/testimonialSchemas.js';
import validateBody from '../decorators/validateBody.js';
import controllers from '../controllers/testimonialsController.js';

const testimonialRouter = express.Router();

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Get list of random testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of testimonials limited to 3
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   testimonial:
 *                     type: string
 *                   ownerName:
 *                     type: string
 *       500:
 *         description: Server error
 */
testimonialRouter.get('/', controllers.getTestimonialsController);

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The testimonial text
 *               recipeId:
 *                 type: string
 *                 description: The ID of the recipe
 *             required:
 *               - text
 *               - recipeId
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 testimonial:
 *                   type: string
 *                 owner:
 *                   type: integer
 *                 recipeId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
testimonialRouter.post(
  '/',
  authenticate,
  validateBody(testimonialSchema),
  controllers.createTestimonialController
);

/**
 * @swagger
 * /testimonials/{recipeId}:
 *   get:
 *     summary: Get testimonials for a specific recipe
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipe
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of testimonials per page
 *     responses:
 *       200:
 *         description: List of testimonials for the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       testimonial:
 *                         type: string
 *                       recipeId:
 *                         type: integer
 *                       owner:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           avatarURL:
 *                             type: string
 *                             nullable: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
testimonialRouter.get(
  '/:recipeId',
  controllers.getTestimonialsByRecipeIdController
);

/**
 * @swagger
 * /testimonials/user/{userId}:
 *   get:
 *     summary: Get testimonials by user
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the current user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of testimonials per page
 *     responses:
 *       200:
 *         description: List of testimonials by user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       testimonial:
 *                         type: string
 *                       recipeId:
 *                         type: integer
 *                       owner:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           avatarURL:
 *                             type: string
 *                             nullable: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
testimonialRouter.get(
  '/user/:userId',
  authenticate,
  controllers.getTestimonialsByUserController
);

/**
 * @swagger
 * /testimonials/user/{testimonialId}:
 *   delete:
 *     summary: Delete a testimonial by its ID for the authenticated user
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testimonialId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the testimonial to delete
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid testimonialId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
testimonialRouter.delete(
  '/user/:testimonialId',
  authenticate,
  controllers.deleteTestimonialsByUserController
);

export default testimonialRouter;
