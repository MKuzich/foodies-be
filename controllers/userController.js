import * as userService from '../services/userService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const getUserInfoController = async (req, res) => {
  const authUserId = Number(req.user.id);
  const targetUserId = Number(req.params.id);

  const isSelf = authUserId === targetUserId;

  const user = await userService.findUserById(targetUserId);
  const createdCount = await userService.countCreatedRecipes(targetUserId);
  const followersCount = await userService.countFollowers(user);
  const followingCount = await userService.countFollowing(user);

  const result = {
    ...user.toPublicJSON(),
    createdCount,
    followersCount,
    followingCount,
  };

  if (isSelf) {
    const favoriteCount = await userService.countFavorites(user);
    result.favoriteCount = favoriteCount;
  } else {
    const isFollowed = await userService.checkIfFollowed(
      authUserId,
      targetUserId
    );
    result.isFollowed = isFollowed;
  }

  res.json(result);
};

export default {
  getUserInfoController: ctrlWrapper(getUserInfoController),
};
