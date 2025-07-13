import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  categoryId: Joi.number().required(),
  areaId: Joi.number().required(),
  title: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        measure: Joi.string().required(),
      })
    )
    .required(),
  time: Joi.string().required(),
});
