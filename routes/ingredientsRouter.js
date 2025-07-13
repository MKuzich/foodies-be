import express from 'express';
import ingredientsController from '../controllers/ingredientsController.js';

const ingredientsRouter = express.Router();

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Get list of ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: List of ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error
 */
ingredientsRouter.get('/', ingredientsController.getAllIngredients);

export default ingredientsRouter;
