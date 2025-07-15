import * as followService from '../services/followService.js';
import * as userService from '../services/userService.js';
import * as recipesService from '../services/recipeService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { getPageParams } from '../helpers/pagination.js';
import HttpError from '../helpers/httpError.js';


const buildPagination = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
});

const getFollowingController = async (req, res) => {
  const { page, limit } = getPageParams(req.query);
  const user = await userService.findUserById(req.user.id);

  const total = await userService.countFollowing(user);
  const followingUsers = await followService.getFollowingUsers(
    user,
    limit,
    (page - 1) * limit
  );

  const results = await Promise.all(
    followingUsers.map(async (followingUser) => {
      const popularRecipes = await recipesService.getTopRecipesByUser(
        followingUser.id,
        4
      );

      return {
        ...followingUser.toPublicJSON(),
        popularRecipes,
      };
    })
  );

  res.json({ results, pagination: buildPagination(total, page, limit) });
};

const getFollowersController = async (req, res) => {
  const { page, limit } = getPageParams(req.query);
  const targetUser = await userService.findUserById(Number(req.params.id));
  const authUserId = Number(req.user.id);

  const total = await userService.countFollowers(targetUser);
  const followers = await followService.getFollowersOfUser(
    targetUser,
    limit,
    (page - 1) * limit
  );

  const results = await Promise.all(
    followers.map(async (follower) => {
      const isFollowed = await userService.checkIfFollowed(
        follower.id,
        authUserId
      );

      const popularRecipes = await recipesService.getTopRecipesByUser(
        follower.id,
        4
      );

      return {
        ...follower.toPublicJSON(),
        isFollowed,
        popularRecipes,
      };
    })
  );

  res.json({ results, pagination: buildPagination(total, page, limit) });
};
const followUserController = async (req, res) => {
  const followerId = req.user.id;
  const followingId = Number(req.params.id);

  if (followerId === followingId) {
    throw HttpError(400, 'You can not follow yourself');
  }

  const userToFollow = await userService.findUserById(followingId);
  const [follow, created] = await followService.followUser(
    followerId,
    followingId
  );

  if (!created) throw HttpError(409, 'Already following this user');

  const followersCount = await userService.countFollowers(userToFollow);
  const followingCount = await userService.countFollowing(
    await userService.findUserById(followerId)
  );

  res.status(201).json({
    ...userToFollow.toPublicJSON(),
    followersCount,
    followingCount,
    isFollowed: true,
  });
};

const unfollowUserController = async (req, res) => {
  const followerId = req.user.id;
  const followingId = Number(req.params.id);

  const userToUnfollow = await userService.findUserById(followingId);
  const deleted = await followService.unfollowUser(followerId, followingId);

  if (!deleted) throw HttpError(404, 'Not following this user');

  const followersCount = await userService.countFollowers(userToUnfollow);
  const followingCount = await userService.countFollowing(
    await userService.findUserById(followerId)
  );

  res.json({
    ...userToUnfollow.toPublicJSON(),
    followersCount,
    followingCount,
    isFollowed: false,
  });
};

export default {
  getFollowersController: ctrlWrapper(getFollowersController),
  getFollowingController: ctrlWrapper(getFollowingController),
  followUserController: ctrlWrapper(followUserController),
  unfollowUserController: ctrlWrapper(unfollowUserController),
};
