import * as userService from '../services/userService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';

const getUserInfo = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserInfo({ id });
  if (!user) {
    throw HttpError(404);
  }
  res.json(user);
};

export default {
  getUserInfo: ctrlWrapper(getUserInfo),
};
