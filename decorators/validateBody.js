import HttpError from '../helpers/httpError.js';

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateBody;
