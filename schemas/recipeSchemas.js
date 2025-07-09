import Joi from "joi";

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
