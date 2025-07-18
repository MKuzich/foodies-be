import express from 'express';
import categoriesControllers from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get list of recipe categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categories'
 *       500:
 *         description: Server error
 */
categoriesRouter.get('/', categoriesControllers.getAllCategories);

export default categoriesRouter;
