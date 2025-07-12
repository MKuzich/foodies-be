import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';
import { Category, User, Area } from '../db/index.js';
import { Op } from 'sequelize';

export const getAllRecipes = async (query) => {
  const { category, area, ingredient } = query;
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
        model: Area,
        as: 'area',
        attributes: ['name'],
        ...(area
          ? {
              where: {
                name: {
                  [Op.iLike]: area,
                },
              },
            }
          : {}),
      },
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'avatarURL'],
      },
      {
        model: Ingredient,
        as: 'ingredients',
        attributes: ['name', 'img'],
        through: {
          attributes: ['measure'],
        },
        ...(ingredient
          ? {
              where: {
                name: {
                  [Op.iLike]: ingredient,
                },
              },
            }
          : {}),
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
