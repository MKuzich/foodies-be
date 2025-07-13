import express from 'express';
import recipesControllers from '../controllers/recipeController.js';
import { createRecipeSchema } from '../schemas/recipeSchemas.js';
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

recipeRouter.delete('/:id', authenticate, recipesControllers.deleteRecipe);

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   post:
 *     summary: Add a recipe to user's favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recipe to add to favorites
 *     responses:
 *       201:
 *         description: Recipe added to favorites
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       404:
 *         description: Recipe not found or already in favorites
 *       500:
 *         description: Server error
 */
recipeRouter.post(
  '/:id/favorite',
  authenticate,
  recipesControllers.addRecipeToFavorites
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
