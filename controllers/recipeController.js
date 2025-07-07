import * as recipeService from "../services/recipeService.js";
import HttpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const notFoundMessage = "Not found";

export const getAllRecipes = async (req, res) => {
  const { id } = req.user;
  const { favorite } = req.query;
  let result;
  if (favorite) {
    result = await recipeService.recipesByStatus({
      owner: id,
      favorite: favorite,
    });
  } else {
    result = await recipeService.allRecipes({ owner: id });
  }
  res.json(result);
};

export const updateRecipeStatus = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await recipeService.updateRecipeStatus(
    { id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, notFoundMessage);
  }

  res.json(result);
};

export default {
  getAllRecipes: ctrlWrapper(getAllRecipes),
  updateRecipeStatus: ctrlWrapper(updateRecipeStatus),
};
