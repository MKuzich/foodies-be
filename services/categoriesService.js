import { Category, Recipe } from '../db/index.js';
import { fn, col, literal } from 'sequelize';

export const getAllCategories = () => {
  return Category.findAll({
    attributes: {
      include: [[fn('COUNT', col('recipes.id')), 'recipeCount']],
    },
    include: [
      {
        model: Recipe,
        as: 'recipes',
        attributes: [],
      },
    ],
    group: ['category.id'],
    order: [literal('"recipeCount" DESC')],
  });
};
