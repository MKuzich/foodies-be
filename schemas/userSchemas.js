import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

const authRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const authEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

// export const followBodySchema = Joi.object({
//   userId: Joi.number().integer().positive().required(),
// });

export default {
  authRegisterSchema,
  authLoginSchema,
  authEmailSchema,
  // followBodySchema,
};
