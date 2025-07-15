import Joi from 'joi';

export const testimonialSchema = Joi.object({
  text: Joi.string().min(3).max(500).required().messages({
    'string.base': 'Text must be a string',
    'string.empty': 'Text is required',
    'string.min': 'Text must be at least 3 characters',
    'string.max': 'Text must be at most 500 characters',
    'any.required': 'Text is required',
  }),
  recipeId: Joi.number().required().messages({
    'number.base': 'recipeId must be a number',
    'number.empty': 'recipeId is required',
    'any.required': 'recipeId is required',
  }),
});
