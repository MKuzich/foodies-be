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

recipeRouter.get('/', recipesControllers.getAllRecipes);
recipeRouter.post(
  '/',
  authenticate,
  upload.single(RECIPE_THUMB_FIELD),
  parseIngredients,
  validateBody(createRecipeSchema),
  recipesControllers.createRecipe
);
recipeRouter.patch(
  '/:id/favorite',
  validateBody(updateStatusSchema),
  recipesControllers.updateRecipeStatus
);

recipeRouter.get('/:id', recipesControllers.getRecipeById);

export default recipeRouter;
