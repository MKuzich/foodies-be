import * as recipesService from '../services/recipeService.js';
import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

export const getAllRecipes = async (req, res) => {
  const recipes = await recipesService.getAllRecipes(req.query);

  if (!recipes) {
    throw HttpError(404, 'Recipes not found');
  }
  const recipesResponse = recipes.map((recipeData) => {
    const recipe = recipeData.toJSON();
    recipe.ingredients = recipe.ingredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      img: ing.img,
      measure: ing['recipe-ingredient']?.measure || null,
    }));
    return {
      ...recipe,
      category: recipe.category?.name,
      categoryId: undefined,
      ownerId: undefined,
    };
  });
  res.json(recipesResponse);
};

export const updateRecipeStatus = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await recipesService.updateRecipeStatus(
    { id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

export default {
  getAllRecipes: ctrlWrapper(getAllRecipes),
  updateRecipeStatus: ctrlWrapper(updateRecipeStatus),
};
