import * as userService from '../services/userService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';
import { AVATAR_FOLDER } from '../constants/files.js';
import { fileUpload } from '../helpers/fileUpload.js';

const register = async (req, res) => {
  const user = await userService.registerUser(req.body);

  res.status(201).json(user);
};

const login = async (req, res) => {
  const { token, user } = await userService.loginUser(req.body);

  res.json({
    token,
    user: user,
  });
};

export const logout = async (req, res) => {
  await userService.logoutUser(req.user);

  res.status(204).json();
};

export const getCurrent = async (req, res) => {
  res.json(req.user.toPublicJSON());
};

export const updateAvatar = async (req, res) => {
  const { id } = req.user;

  if (!req.file) {
    throw HttpError(404, 'No file uploaded');
  }

  const avatarURL = (await fileUpload(req.file.path, AVATAR_FOLDER)) || null;

  await userService.updateAvatar(id, avatarURL);

  res.json({ avatarURL });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
