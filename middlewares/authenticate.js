import { verifyToken } from "../helpers/jwt.js";
import HttpError from "../helpers/HttpError.js";
//TODO: add find user from services

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return next(HttpError(401, "Authorization header missing"));

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer")
    return next(HttpError(401, "Authorization header not Bearer"));

  const { payload, error } = verifyToken(token);

  if (error) return next(HttpError(401, error.message));

  // const user = await authServices.findUser(payload.id);

  // if (!user || !user.token)
  //   return next(HttpError(401, "User not found"));

  req.user = user;
  next();
};

export default authenticate;
