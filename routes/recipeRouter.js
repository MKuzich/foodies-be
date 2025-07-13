import express from 'express';
import recipesControllers from '../controllers/recipeController.js';
import {
  updateStatusSchema,
  createRecipeSchema,
} from '../schemas/recipeSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import parseIngredients from '../middlewares/parseIngredients.js';
import { upload } from '../middlewares/upload.js';
import validateBody from '../decorators/validateBody.js';
import { RECIPE_THUMB_FIELD } from '../constants/files.js';

const recipeRouter = express.Router();


/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of recipes
 *       500:
 *         description: Server error
 */
recipeRouter.get('/', recipesControllers.getAllRecipes);
recipeRouter.post(
  '/',
  authenticate,
  upload.single(RECIPE_THUMB_FIELD),
  parseIngredients,
  validateBody(createRecipeSchema),
  recipesControllers.createRecipe
);

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   patch:
 *     summary: Add or remove a recipe from favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               favorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Favorite status updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */
recipeRouter.patch(
  '/:id/favorite',
  validateBody(updateStatusSchema),
  recipesControllers.updateRecipeStatus
);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get recipe details by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe details
 *       404:
 *         description: Recipe not found
 */
recipeRouter.get('/:id', recipesControllers.getRecipeById);

export default recipeRouter;
