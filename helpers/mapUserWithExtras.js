import * as recipesService from '../services/recipeService.js';

export const mapUserWithExtras = async (user) => {
  const [popularRecipes, ownRecipes] = await Promise.all([
    recipesService.getTopRecipesByUser(user.id, 4),
    recipesService.countRecipesByUser(user.id),
  ]);

  return {
    ...user.toPublicJSON(),
    ownRecipes,
    popularRecipes,
  };
};
