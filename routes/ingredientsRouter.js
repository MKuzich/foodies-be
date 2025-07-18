import express from 'express';
import ingredientsController from '../controllers/ingredientsController.js';

const ingredientsRouter = express.Router();

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Get a list of ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: List of the ingredient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredients'
 *       500:
 *         description: Server error
 */
ingredientsRouter.get('/', ingredientsController.getAllIngredients);

export default ingredientsRouter;
