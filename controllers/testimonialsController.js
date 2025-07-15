import * as testimonialsService from '../services/testimonialsService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Recipe } from '../db/index.js';
import HttpError from '../helpers/httpError.js';

export const getTestimonialsController = async (req, res) => {
  const result = await testimonialsService.getTestimonials();
  const testimonials = result.map(({ id, testimonial, user }) => ({
    id,
    testimonial,
    ownerName: user.name,
  }));
  res.json(testimonials);
};

export const createTestimonialController = async (req, res) => {
  const { text, recipeId } = req.body;
  const userId = req.user.id;
  const recipeExists = await Recipe.findByPk(recipeId);
  if (!recipeExists) {
    throw HttpError(404, 'Recipe not found');
  }
  const testimonial = await testimonialsService.createTestimonial({
    testimonial: text,
    owner: userId,
    recipeId,
  });

  res.status(201).json(testimonial);
};

export const getTestimonialsByRecipeIdController = async (req, res) => {
  const recipeId = Number(req.params.recipeId);
  if (!recipeId || isNaN(recipeId)) {
    throw HttpError(400, 'Valid recipeId is required in query params');
  }
  const recipeExists = await Recipe.findByPk(recipeId);
  if (!recipeExists) {
    throw HttpError(404, 'Recipe not found');
  }
  const testimonials =
    await testimonialsService.getTestimonialsByRecipeId(recipeId);
  res.status(200).json(testimonials);
};

export default {
  getTestimonialsController: ctrlWrapper(getTestimonialsController),
  createTestimonialController: ctrlWrapper(createTestimonialController),
  getTestimonialsByRecipeIdController: ctrlWrapper(
    getTestimonialsByRecipeIdController
  ),
};
