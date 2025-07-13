import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';
import { Category, User, Area, RecipeIngredient } from '../db/index.js';
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

export const getAllRecipes = async ({
  query,
  page,
  limit,
  ownerId,
  attributes,
}) => {
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

  const ownerFilter = ownerId
    ? [
        {
          model: User,
          as: 'owner',
          where: { id: ownerId },
          required: true,
          attributes: [],
        },
      ]
    : [];

  const include = ownerId
    ? ownerFilter
    : [
        categoryFilter,
        areaFilter,
        ...ingredientFilter,
        ownerInclude,
        ingredientsInclude,
      ];

  const total = await Recipe.count({
    include: ownerId
      ? ownerFilter
      : [categoryFilter, areaFilter, ...ingredientFilter],
  });

  const recipes = await Recipe.findAll({
    include,
    order: [['id', 'ASC']],
    limit,
    offset,
    attributes,
  });

  return { recipes, total };
};

export const getRecipeById = async (id) => {
  return Recipe.findByPk(id, {
    include: [categoryInclude, areaInclude, ownerInclude, ingredientsInclude],
  });
};

export const createRecipe = async (data, getIngredientsData) => {
  const recipe = await Recipe.create(data);
  const ingredientsData = getIngredientsData(recipe.id);
  await RecipeIngredient.bulkCreate(ingredientsData);
  return getRecipeById(recipe.id);
};
