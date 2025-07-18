import { User, Recipe, Follow } from '../db/index.js';
import { createToken } from '../helpers/jwt.js';
import HttpError from '../helpers/httpError.js';
import { comparePasswords, hashPassword } from '../helpers/hash.js';

export const findUser = (query) => {
  return User.findOne({
    where: query,
  });
};

export const registerUser = async (payload) => {
  const hashedPassword = await hashPassword(payload.password);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  const token = createToken({ id: user.id });

  user.token = token;
  await user.save();

  return {
    token,
    user: user.toPublicJSON(),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(401, 'Email or password is wrong');

  const passwordCompare = await comparePasswords(password, user.password);
  if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');

  const payload = { id: user.id };

  const token = createToken(payload);

  user.token = token;
  await user.save();

  return {
    token,
    user: user.toPublicJSON(),
  };
};

export const logoutUser = async ({ id }) => {
  try {
    const user = await findUser({ id });
    if (!user) throw HttpError(401, 'User not found');
    user.token = '';
    await user.save();
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const updateAvatar = async (id, avatar) => {
  try {
    const user = await findUser({ id });
    if (!user) throw HttpError(404, 'User not found');

    user.avatarURL = avatar;
    await user.save();
  } catch (error) {
    throw HttpError(500, error.message);
  }
};

export const findUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw HttpError(404, 'User not found');
  return user;
};

export const countCreatedRecipes = async (userId) => {
  return Recipe.count({ where: { ownerId: String(userId) } });
};

export const countFavorites = async (user) => {
  return (await user.countFavoriteRecipes?.()) || 0;
};

export const countFollowers = (user) => user.countFollowers();
export const countFollowing = (user) => user.countFollowing();

export const checkIfFollowed = async (followerId, followingId) => {
  const follow = await Follow.findOne({
    where: {
      followerId,
      followingId,
    },
  });
  return !!follow;
};
