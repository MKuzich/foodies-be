import {
  Category,
  Recipe,
  Ingredient,
  User,
  Area,
  RecipeIngredient,
  UserFavorite,
} from '../db/index.js';
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

export const getRecipeById = async (id, currentUserId = null) => {
  const recipe = await Recipe.findByPk(id, {
    include: [categoryInclude, areaInclude, ownerInclude, ingredientsInclude],
  });

  if (!recipe) {
    return null;
  }
  return recipe;
};

export const createRecipe = async (data, getIngredientsData) => {
  const recipe = await Recipe.create(data);
  const ingredientsData = getIngredientsData(recipe.id);
  await RecipeIngredient.bulkCreate(ingredientsData);
  return getRecipeById(recipe.id);
};

export const getTopRecipeIds = async (limit = 4) => {
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

export const getRandomRecipes = async (excludeIds, count) =>
  Recipe.findAll({
    where: {
      id: {
        [Op.notIn]: excludeIds,
      },
    },
    attributes: ['id'],
    order: sequelize.random(),
    limit: count,
  });

export const getRecipesByIds = async (recipeIds) => {
  return Recipe.findAll({
    where: {
      id: recipeIds,
    },
    attributes: ['id', 'title', 'description', 'thumb'],
    include: [ownerInclude],
    order: [
      [
        sequelize.literal(
          `ARRAY_POSITION(ARRAY[${recipeIds.reverse().join(',')}], "recipe"."id")`
        ),
        'DESC',
      ],
    ],
  });
};

export const getTopRecipeIdsByUser = async (userId, limit = 4) => {
  const results = await sequelize.query(
    `
    SELECT r.id
    FROM recipes r
    LEFT JOIN user_favorites uf ON r.id = uf."recipeId"
    WHERE r."ownerId" = :userId
    GROUP BY r.id
    ORDER BY COUNT(uf."recipeId") DESC
    LIMIT :limit
    `,
    {
      replacements: { userId, limit },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return results.map((r) => r.id);
};

export const getTopRecipesByUser = async (userId, limit = 4) => {
  const topIds = await getTopRecipeIdsByUser(userId, limit);

  if (topIds.length === 0) {
    return Recipe.findAll({
      where: { ownerId: userId },
      order: sequelize.random(),
      limit,
      attributes: ['id', 'title', 'description', 'thumb'],
    });
  }

  return Recipe.findAll({
    where: { id: topIds },
    attributes: ['id', 'title', 'description', 'thumb'],
    include: [ownerInclude],
    order: [
      [
        sequelize.literal(
          `ARRAY_POSITION(ARRAY[${topIds.reverse().join(',')}], "recipe"."id")`
        ),
        'DESC',
      ],
    ],
  });
};

export const countRecipesByUser = async (userId) => {
  return Recipe.count({
    where: { ownerId: userId },
  });
};

export const getFavoriteRecipes = async (userId, page, limit) => {
  const offset = (page - 1) * limit;
  const isAll = limit === -1;
  const { count, rows } = await UserFavorite.findAndCountAll({
    where: { userId },
    limit: isAll ? undefined : limit,
    offset: isAll ? undefined : offset,
    include: [
      {
        model: Recipe,
        as: 'recipe',
        attributes: ['id', 'title', 'description', 'thumb'],
      },
    ],
    order: [['recipeId', 'DESC']],
  });

  const data = rows.map((recipe) => recipe.recipe.get({ plain: true }));

  return {
    data,
    total: count,
  };
};
