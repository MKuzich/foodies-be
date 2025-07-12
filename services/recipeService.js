import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';
import { Category } from '../db/index.js';
import { Op } from 'sequelize';

export const getAllRecipes = async (query) => {
  const { category } = query;
  return Recipe.findAll({
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['name'],
        ...(category
          ? {
              where: {
                name: {
                  [Op.iLike]: category,
                },
              },
            }
          : {}),
      },
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
