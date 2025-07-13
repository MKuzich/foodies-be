import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';
import { Category, User, Area } from '../db/index.js';
import { Op } from 'sequelize';

export const getAllRecipes = async (query, page, limit) => {
  const { category, area, ingredient } = query;
  const offset = (page - 1) * limit;
  const categoryFilter = {
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
  };
  const areaFilter = {
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
  };

  const ingredientFilter = ingredient
    ? [
        {
          model: Ingredient,
          as: 'ingredientFilter',
          where: {
            name: {
              [Op.iLike]: ingredient,
            },
          },
          required: true,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ]
    : [];

  const allIngredientsInclude = {
    model: Ingredient,
    as: 'ingredients',
    attributes: ['name', 'img'],
    through: {
      attributes: ['measure'],
    },
  };

  const total = await Recipe.count({
    include: [categoryFilter, areaFilter, ...ingredientFilter],
  });

  const recipes = await Recipe.findAll({
    include: [
      categoryFilter,
      areaFilter,
      ...ingredientFilter,
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'avatarURL'],
      },
      allIngredientsInclude,
    ],
    order: [['id', 'ASC']],
    limit,
    offset,
  });

  return { recipes, total };
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
