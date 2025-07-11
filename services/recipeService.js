import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';

export const getAllRecipes = async (query) => {
  return Recipe.findAll({
    where: query,
    include: [
      {
        model: Ingredient,
        as: 'ingredients',
        attributes: ['name', 'img'],
        through: {
          attributes: ['measure'],
        },
      },
    ],
  });
};

export const getRecipeById = async (query) => {
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
