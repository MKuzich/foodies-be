import {User, Recipe, Follow} from '../db/index.js';
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

export const getUserInfo = async (authUserId, targetUserId) => {
  const userId = Number(authUserId);
  const targetId = Number(targetUserId);

  const user = await User.findByPk(targetId);
  if (!user) throw HttpError(404, 'User not found');

  const baseInfo = user.toPublicJSON();

  const createdCount = await Recipe.count({ where: { owner: String(targetId) } });
  const followersCount = await user.countFollowers();
  const followingCount = await user.countFollowing();

  const isSelf = userId === targetId;

  const result = {
    ...baseInfo,
    createdCount,
    followersCount,
    followingCount,
  };

  if (isSelf) {
    const favoriteCount = (await user.countFavorites?.()) || 0;
    const followingCount = await user.countFollowing();
    result.favoriteCount = favoriteCount;
    result.followingCount = followingCount;
  } else {
    const follow = await Follow.findOne({
      where: {
        followerId: userId,
        followingId: targetId,
      },
    });

    result.isFollowed = !!follow; 
  }

  return result;
};
