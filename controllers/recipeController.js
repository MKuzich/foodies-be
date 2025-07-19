import * as recipesService from '../services/recipeService.js';
import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { getPagination } from '../helpers/pagination.js';
import {
  fileUpload,
  deleteImageFromCloudinary,
} from '../helpers/fileStorage.js';
import { RECIPE_THUMB_FOLDER } from '../constants/files.js';

const mapRecipe = (recipeData) => {
  const recipe = recipeData.toJSON();
  recipe.ingredients = recipe.ingredients.map((ing) => ({
    id: ing.id,
    name: ing.name,
    img: ing.img,
    measure: ing['recipe-ingredient']?.measure || null,
  }));
  return {
    ...recipe,
    category: recipe.category?.name,
    area: recipe.area?.name,
    categoryId: undefined,
    ownerId: undefined,
    areaId: undefined,
  };
};

export const getAllRecipes = async (req, res) => {
  const { page = 1, limit = 12, ...query } = req.query;
  const { recipes, total } = await recipesService.getAllRecipes({
    query,
    page,
    limit,
  });

  if (!recipes) {
    throw HttpError(404, 'Recipes not found');
  }
  const data = recipes.map(mapRecipe);
  const pagination = getPagination(total, page, limit);
  res.json({ data, pagination });
};

export const getUserRecipes = async (req, res) => {
  const { page = 1, limit = 12, ...query } = req.query;
  const id = Number(req.params.id);
  const { recipes, total } = await recipesService.getAllRecipes({
    query,
    page,
    limit,
    ownerId: id,
    attributes: ['id', 'title', 'description', 'thumb'],
  });

  if (!recipes) {
    throw HttpError(404, 'Recipes not found');
  }
  const pagination = getPagination(total, page, limit);
  res.json({ data: recipes, pagination });
};

export const getRecipeById = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user?.id ?? null;

  const recipeData = await recipesService.getRecipeById(id, currentUserId);
  if (!recipeData) {
    throw HttpError(404, 'Recipe not found');
  }
  const isFavorite = await recipeData.hasUsersWhoFavorited(currentUserId);
  const recipe = mapRecipe(recipeData);
  recipe.isFavorite = isFavorite;
  res.json(recipe);
};

export const createRecipe = async (req, res) => {
  const { id: ownerId } = req.user;

  if (!req.file) {
    throw HttpError(404, 'No file uploaded');
  }

  const filePath = req.file.path;
  const thumb = (await fileUpload(filePath, RECIPE_THUMB_FOLDER)) || null;

  const { ingredients, categoryId, areaId, ...recipeData } = req.body;

  const getIngredientsData = (recipeId) =>
    ingredients.map(({ id, measure }) => ({
      recipeId,
      ingredientId: id,
      measure,
    }));
  const recipe = await recipesService.createRecipe(
    {
      ...recipeData,
      categoryId: Number(categoryId),
      areaId: Number(areaId),
      ownerId,
      thumb,
    },
    getIngredientsData
  );
  if (!recipe) {
    throw HttpError(400, 'Failed to create recipe');
  }
  res.status(201).json(mapRecipe(recipe));
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const { id: ownerId } = req.user;
  const recipe = await recipesService.getRecipeById(id);
  if (!recipe) {
    throw HttpError(404, 'Recipe not found');
  }
  if (recipe.ownerId !== ownerId) {
    throw HttpError(403, 'You do not have permission to delete this recipe');
  }
  if (recipe.thumb?.includes('res.cloudinary.com')) {
    await deleteImageFromCloudinary(recipe.thumb);
  }
  await recipe.destroy();
  res.status(204).json(recipe);
};

export const addRecipeToFavorites = async (req, res) => {
  const user = req.user;
  const recipeId = Number(req.params.id);
  const recipe = await recipesService.getRecipeById(recipeId);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  const isAlreadyFavorite = await user.hasFavoriteRecipe(recipe);
  if (isAlreadyFavorite) {
    return res.status(409).json({ message: 'Recipe already in favorites' });
  }
  await user.addFavoriteRecipe(recipe);
  res.status(201).json({ message: 'Recipe added to favorites' });
};

export const removeRecipeFromFavorites = async (req, res) => {
  const user = req.user;
  const recipeId = Number(req.params.id);
  const recipe = await recipesService.getRecipeById(recipeId);

  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  const isAlreadyFavorite = await user.hasFavoriteRecipe(recipe);
  if (!isAlreadyFavorite) {
    return res.status(404).json({ message: 'Recipe is not in favorites' });
  }

  await user.removeFavoriteRecipe(recipe);
  res.status(204).send();
};

export const getFavoriteRecipes = async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 9 } = req.query;

  const { total, data } = await recipesService.getFavoriteRecipes(
    userId,
    Number(page),
    Number(limit)
  );

  const pagination = getPagination(total, page, limit);
  res.json({ data, pagination });
};

export const getPopularRecipes = async (req, res) => {
  const LIMIT = 4;
  const excludeId = Number(req.query.exclude);

  const topRecipeIds = await recipesService.getTopRecipeIds();

  const filteredTopIds = topRecipeIds.filter((id) => id !== excludeId);

  if (filteredTopIds.length < LIMIT) {
    const neededCount = LIMIT - filteredTopIds.length;

    const excludeIds = [...filteredTopIds, excludeId].map(Number);

    const randomRecipes = await recipesService.getRandomRecipes(
      excludeIds,
      neededCount
    );

    const randomIds = randomRecipes.map((recipe) => recipe.id);
    filteredTopIds.push(...randomIds);
  }

  const popularRecipes = await recipesService.getRecipesByIds(filteredTopIds);
  if (!popularRecipes || popularRecipes.length === 0) {
    throw HttpError(404, 'No popular recipes found');
  }
  res.json(popularRecipes);
};

export default {
  getAllRecipes: ctrlWrapper(getAllRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getUserRecipes: ctrlWrapper(getUserRecipes),
  createRecipe: ctrlWrapper(createRecipe),
  deleteRecipe: ctrlWrapper(deleteRecipe),
  addRecipeToFavorites: ctrlWrapper(addRecipeToFavorites),
  removeRecipeFromFavorites: ctrlWrapper(removeRecipeFromFavorites),
  getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
  getPopularRecipes: ctrlWrapper(getPopularRecipes),
};
