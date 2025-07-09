import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as categoriesService from '../services/categoriesService.js';
import HttpError from '../helpers/httpError.js';

const getAllCategories = async (req, res) => {
  const categories = await categoriesService.getAllCategories();
  if (!categories) {
    throw HttpError(404, 'Contacts not found');
  }
  res.json(categories);
};

export default {
  getAllCategories: ctrlWrapper(getAllCategories),
};
