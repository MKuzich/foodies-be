import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as ingredientsService from '../services/ingredientsService.js';
import HttpError from '../helpers/httpError.js';

const getAllIngredients = async (req, res) => {
  const ingredients = await ingredientsService.getAllIngredients();
  if (!ingredients) {
    throw HttpError(404, 'Ingredients not found');
  }
  res.json(ingredients);
};

export default {
  getAllIngredients: ctrlWrapper(getAllIngredients),
};
