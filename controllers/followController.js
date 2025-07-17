import * as followService from '../services/followService.js';
import * as userService from '../services/userService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';
import { getPageParams, getPagination } from '../helpers/pagination.js';
import { mapUserWithExtras } from '../helpers/mapUserWithExtras.js';

const getFollowingController = async (req, res) => {
  const { page, limit } = getPageParams(req.query);
  const currentUserId = Number(req.user.id);
  const user = await userService.findUserById(currentUserId);

  const total = await userService.countFollowing(user);
  const followingUsers = await followService.getFollowingUsers(
    user,
    limit,
    (page - 1) * limit
  );

  const results = await Promise.all(
    followingUsers.map(async (followingUser) => {
      const [extras, isFollowed] = await Promise.all([
        mapUserWithExtras(followingUser),
        userService.checkIfFollowed(currentUserId, followingUser.id),
      ]);

      return {
        ...extras,
        isFollowed,
      };
    })
  );

  res.json({ results, pagination: getPagination(total, page, limit) });
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
      const isFollowing = await userService.checkIfFollowed(
        authUserId,
        follower.id
      );
      const extras = await mapUserWithExtras(follower);

      return {
        ...extras,
        isFollowing,
      };
    })
  );

  res.json({ results, pagination: getPagination(total, page, limit) });
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

  const result = {
    ...userToFollow.toPublicJSON(),
    followersCount,
    followingCount,
    isFollowed: true,
  };

  res.status(201).json(result);
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

  const result = {
    ...userToUnfollow.toPublicJSON(),
    followersCount,
    followingCount,
    isFollowed: false,
  };

  res.json(result);
};

export default {
  getFollowersController: ctrlWrapper(getFollowersController),
  getFollowingController: ctrlWrapper(getFollowingController),
  followUserController: ctrlWrapper(followUserController),
  unfollowUserController: ctrlWrapper(unfollowUserController),
};
