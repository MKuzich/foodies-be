import { Testimonial, User } from '../db/index.js';
import sequelize from '../db/sequelize.js';

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

export const getTestimonialsByRecipeId = async (recipeId) => {
  const testimonials = await Testimonial.findAll({
    where: { recipeId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatarURL'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  return testimonials;
};
