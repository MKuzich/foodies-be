import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as areasService from '../services/areasService.js';
import HttpError from '../helpers/httpError.js';

const getAllAreas = async (req, res) => {
  const areas = await areasService.getAllAreas();
  if (!areas) {
    throw HttpError(404, 'Areas not found');
  }
  res.json(areas);
};

export default {
  getAllAreas: ctrlWrapper(getAllAreas),
};
