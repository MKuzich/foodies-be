import express from 'express';
import recipesControllers from '../controllers/recipeController.js';
import { createRecipeSchema } from '../schemas/recipeSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import parseIngredients from '../middlewares/parseIngredients.js';
import { upload } from '../middlewares/upload.js';
import validateBody from '../decorators/validateBody.js';
import { RECIPE_THUMB_FIELD } from '../constants/files.js';
import optionalAuthenticate from '../middlewares/optionalAuthenticate.js';

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipes'
 *       500:
 *         description: Server error
 */
recipeRouter.get('/', recipesControllers.getAllRecipes);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 examples: []
 *     responses:
 *       201:
 *         description: Recipe added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
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
 * /recipes/favorites:
 *   get:
 *     summary: Get a list of favorite recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite recipes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipesSummary'
 */
recipeRouter.get(
  '/favorites',
  authenticate,
  recipesControllers.getFavoriteRecipes
);

/**
 * @swagger
 * /recipes/popular:
 *   get:
 *     summary: Get a list of popular recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of popular recipes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeSummaryWithOwner'
 */
recipeRouter.get('/popular', recipesControllers.getPopularRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeWithIsFavorite'
 *       404:
 *         description: Recipe not found
 */
recipeRouter.get(
  '/:id',
  optionalAuthenticate,
  recipesControllers.getRecipeById
);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       401:
 *         description: Unauthorized – token missing or invalid
 *       403:
 *         description: Forbidden – You do not have permission to delete this recipe
 *       404:
 *         description: Recipe not found
 */
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
 * /recipes/{id}/favorite:
 *   delete:
 *     summary: Remove a recipe from user's favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recipe to remove from favorites
 *     responses:
 *       204:
 *         description: Recipe removed from favorites
 *       401:
 *         description: Unauthorized – token missing or invalid
 */
recipeRouter.delete(
  '/:id/favorite',
  authenticate,
  recipesControllers.removeRecipeFromFavorites
);

export default recipeRouter;
