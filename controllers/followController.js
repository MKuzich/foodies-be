import * as followService from '../services/followService.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { getPageParams } from '../helpers/pagination.js';


const getFollowingController = async (req, res) => {
  const { page, limit } = getPageParams(req.query);
  const userId = req.user.id;

  const data = await followService.getFollowing(userId, page, limit);
  res.json(data);
};

const getFollowersController = async (req, res) => {
  const { page, limit } = getPageParams(req.query);
  const id = Number(req.params.id);

  const data = await followService.getFollowers(id, page, limit);
  res.json(data);
};

const followUserController = async (req, res) => {
  const followerId = req.user.id;
  const followingId = Number(req.params.id);

  const user =await followService.followUser(followerId, followingId);
  res.status(201).json(user);
};
const unfollowUserController = async (req, res) => {
  const followerId = req.user.id;
  const followingId = Number(req.params.id);

  const user = await followService.unfollowUser(followerId, followingId);
  res.json(user);
};

export default {
  getFollowersController: ctrlWrapper(getFollowersController),
  getFollowingController: ctrlWrapper(getFollowingController),
  followUserController: ctrlWrapper(followUserController),
  unfollowUserController: ctrlWrapper(unfollowUserController),
};
