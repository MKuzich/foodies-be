import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';
import { Category, User, Area } from '../db/index.js';
import { Op } from 'sequelize';

const categoryInclude = {
  model: Category,
  as: 'category',
  attributes: ['name'],
};

const areaInclude = {
  model: Area,
  as: 'area',
  attributes: ['name'],
};

const ownerInclude = {
  model: User,
  as: 'owner',
  attributes: ['id', 'name', 'avatarURL'],
};

const ingredientsInclude = {
  model: Ingredient,
  as: 'ingredients',
  attributes: ['name', 'img'],
  through: {
    attributes: ['measure'],
  },
};

export const getAllRecipes = async (query, page, limit) => {
  const { category, area, ingredient } = query;
  const offset = (page - 1) * limit;
  const categoryFilter = {
    ...categoryInclude,
    ...(category ? { where: { name: { [Op.iLike]: category } } } : {}),
  };
  const areaFilter = {
    ...areaInclude,
    ...(area ? { where: { name: { [Op.iLike]: area } } } : {}),
  };

  const ingredientFilter = ingredient
    ? [
        {
          model: Ingredient,
          as: 'ingredientFilter',
          where: { name: { [Op.iLike]: ingredient } },
          required: true,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ]
    : [];

  const total = await Recipe.count({
    include: [categoryFilter, areaFilter, ...ingredientFilter],
  });

  const recipes = await Recipe.findAll({
    include: [
      categoryFilter,
      areaFilter,
      ...ingredientFilter,
      ownerInclude,
      ingredientsInclude,
    ],
    order: [['id', 'ASC']],
    limit,
    offset,
  });

  return { recipes, total };
};

export const getRecipeById = async (id) => {
  return Recipe.findOne({
    where: { id },
    include: [categoryInclude, areaInclude, ownerInclude, ingredientsInclude],
  });
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
