import { verifyToken } from '../helpers/jwt.js';
import { findUser } from '../services/userService.js';

const optionalAuthenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next();
  }

  const { payload, error } = verifyToken(token);
  if (error) {
    return next();
  }

  const user = await findUser({ id: payload.id });
  if (!user || user.token !== token) {
    return next();
  }

  req.user = user;
  next();
};

export default optionalAuthenticate;
