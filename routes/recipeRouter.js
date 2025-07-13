import express from 'express';
import recipesControllers from '../controllers/recipeController.js';
import { updateStatusSchema } from '../schemas/recipeSchemas.js';
import validateBody from '../decorators/validateBody.js';

const recipeRouter = express.Router();

recipeRouter.get('/', recipesControllers.getAllRecipes);
recipeRouter.patch(
  '/:id/favorite',
  validateBody(updateStatusSchema),
  recipesControllers.updateRecipeStatus
);

recipeRouter.get('/:id', recipesControllers.getRecipeById);

export default recipeRouter;
