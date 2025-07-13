import * as recipesService from '../services/recipeService.js';
import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { getPagination } from '../helpers/pagination.js';

export const getAllRecipes = async (req, res) => {
  const { page = 1, limit = 12, ...query } = req.query;
  const { recipes, total } = await recipesService.getAllRecipes(
    query,
    page,
    limit
  );

  if (!recipes) {
    throw HttpError(404, 'Recipes not found');
  }
  const data = recipes.map((recipeData) => {
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
      area: recipe.area?.name,
      categoryId: undefined,
      ownerId: undefined,
      areaId: undefined,
    };
  });
  const pagination = getPagination(total, page, limit);
  res.json({ data, pagination });
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
