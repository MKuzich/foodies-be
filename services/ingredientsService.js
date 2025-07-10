import Ingredient from '../db/Ingredient.js';

export const getAllIngredients = () => {
  return Ingredient.findAll({
    attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] },
  });
};
