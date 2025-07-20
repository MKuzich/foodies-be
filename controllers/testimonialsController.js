import * as testimonialsService from '../services/testimonialsService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { Recipe } from '../db/index.js';
import HttpError from '../helpers/httpError.js';
import { getPagination } from '../helpers/pagination.js';

export const getTestimonialsController = async (req, res) => {
  const { limit = 3 } = req.query;
  const result = await testimonialsService.getTestimonials({ limit });
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
  const { page, limit } = req.query;
  if (!recipeId || isNaN(recipeId)) {
    throw HttpError(400, 'Valid recipeId is required in query params');
  }
  const recipeExists = await Recipe.findByPk(recipeId);
  if (!recipeExists) {
    throw HttpError(404, 'Recipe not found');
  }
  const { testimonials, total } =
    await testimonialsService.getTestimonialsByRecipeId(recipeId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

  const pagination = getPagination(total, page, limit);

  res.status(200).json({
    message: 'Recipe testimonials fetched successfully',
    data: testimonials,
    pagination,
  });
};

export const getTestimonialsByUserController = async (req, res) => {
  const userId = Number(req.params.userId);
  const currentUserId = req.user.id;
  const { page, limit } = req.query;

  if (!userId || isNaN(userId)) {
    throw HttpError(400, 'Valid userId is required in query params');
  }
  if (currentUserId !== userId) {
    throw HttpError(403, 'Access denied');
  }

  const { testimonials, total } =
    await testimonialsService.getTestimonialsByUser(userId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

  const pagination = getPagination(total, page, limit);

  res.status(200).json({
    message: 'User testimonials fetched successfully',
    data: testimonials,
    pagination,
  });
};

export const deleteTestimonialsByUserController = async (req, res) => {
  const testimonialId = Number(req.params.testimonialId);
  const userId = req.user.id;
  if (!testimonialId || isNaN(testimonialId)) {
    throw HttpError(400, 'Valid testimonialId is required in query params');
  }

  const result = await testimonialsService.deleteTestimonialsByUser({
    testimonialId,
    userId,
  });

  res.status(200).json(result);
};

export default {
  getTestimonialsController: ctrlWrapper(getTestimonialsController),
  createTestimonialController: ctrlWrapper(createTestimonialController),
  getTestimonialsByRecipeIdController: ctrlWrapper(
    getTestimonialsByRecipeIdController
  ),
  getTestimonialsByUserController: ctrlWrapper(getTestimonialsByUserController),
  deleteTestimonialsByUserController: ctrlWrapper(
    deleteTestimonialsByUserController
  ),
};
