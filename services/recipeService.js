import Recipe from '../db/Recipe.js';

export const allRecipes = async (query) => {
  return Recipe.findAll({ where: query });
};

export const getContactById = async (query) => {
  return Recipe.findOne({ where: query });
};

export const updateRecipeStatus = async (query, data) => {
  const recipe = await getRecipeById(query);
  if (!recipe) return null;
  await recipe.update(data);
  return recipe;
};

export const recipesByStatus = async (query) => {
  const recipes = await allRecipes(query);
  if (!recipes) return null;
  return recipes;
};
