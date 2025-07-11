import * as userService from '../services/userService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';

const getUserInfoController = async (req, res) => {
  const authUserId = req.user.id;
  const targetUserId = req.params.id;

  const user = await userService.getUserInfo(authUserId, targetUserId);

  if (!user) throw HttpError(404, 'User not found');
  
  res.json(user);
};

export default {
  getUserInfoController: ctrlWrapper(getUserInfoController),
};
