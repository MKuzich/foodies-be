import { Testimonial, User, Recipe } from '../db/index.js';
import sequelize from '../db/sequelize.js';
import HttpError from '../helpers/httpError.js';

export const getTestimonials = async ({ limit }) => {
  return Testimonial.findAll({
    attributes: ['id', 'testimonial'],
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'avatarURL'],
    },
    order: sequelize.random(),
    limit,
  });
};

export const createTestimonial = async ({ testimonial, owner, recipeId }) => {
  const newTestimonial = await Testimonial.create({
    testimonial,
    owner,
    recipeId,
  });

  return newTestimonial;
};

export const getTestimonialsByRecipeId = async (
  recipeId,
  { page = 1, limit = 10 }
) => {
  const offset = (page - 1) * limit;

  const { count, rows: testimonials } = await Testimonial.findAndCountAll({
    where: { recipeId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatarURL'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    total: count,
    page,
    limit,
    testimonials,
  };
};

export const getTestimonialsByUser = async (
  userId,
  { page = 1, limit = 10 }
) => {
  const offset = (page - 1) * limit;

  const { count, rows: testimonials } = await Testimonial.findAndCountAll({
    where: { owner: userId },
    include: [
      {
        model: Recipe,
        as: 'recipe',
        attributes: ['id', 'title', 'thumb'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    total: count,
    page,
    limit,
    testimonials,
  };
};

export const deleteTestimonialsByUser = async ({ userId, testimonialId }) => {
  const testimonial = await Testimonial.findOne({
    where: {
      id: testimonialId,
      owner: userId,
    },
  });

  if (!testimonial) {
    throw HttpError(404, 'Testimonial not found');
  }

  await testimonial.destroy();

  return { message: 'Testimonial deleted successfully' };
};
