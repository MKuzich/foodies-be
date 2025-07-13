import { Recipe } from '../db/index.js';
import { Ingredient } from '../db/index.js';
import { Category, User, Area, RecipeIngredient } from '../db/index.js';
import { Op } from 'sequelize';
import sequelize from '../db/sequelize.js';

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

const getTopRecipeIds = async (limit = 4) => {
  const results = await sequelize.query(
    `
    SELECT "recipeId", COUNT(*) as "favoritesCount"
    FROM user_favorites
    GROUP BY "recipeId"
    ORDER BY "favoritesCount" DESC
    LIMIT :limit
  `,
    {
      replacements: { limit },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return results.map((result) => result.recipeId);
};

export const getPopularRecipes = async (limit = 4) => {
  const topRecipeIds = await getTopRecipeIds(limit);

  if (topRecipeIds.length < limit) {
    const neededCount = limit - topRecipeIds.length;

    const randomRecipes = await Recipe.findAll({
      where: {
        id: {
          [Op.notIn]: topRecipeIds,
        },
      },
      attributes: ['id'],
      order: sequelize.random(),
      limit: neededCount,
    });

    const randomIds = randomRecipes.map((recipe) => recipe.id);
    topRecipeIds.push(...randomIds);
  }

  return Recipe.findAll({
    where: {
      id: topRecipeIds,
    },
    attributes: ['id', 'title', 'description', 'thumb'],
    include: [ownerInclude],
    order: [
      [
        sequelize.literal(
          `ARRAY_POSITION(ARRAY[${topRecipeIds.reverse().join(',')}], "recipe"."id")`
        ),
        'DESC',
      ],
    ],
  });
};
