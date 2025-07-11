import express from 'express';

import userController from '../controllers/userController.js';
import followControllers from '../controllers/followController.js';

import authenticate from '../middlewares/authenticate.js';

const userRouter = express.Router();

userRouter.get(
  '/following',
  authenticate,
  followControllers.getFollowingController
);

userRouter.get(
  '/:id/followers',
  authenticate,
  followControllers.getFollowersController
);

userRouter.post(
  '/:id/follow',
  authenticate,
  followControllers.followUserController
);

userRouter.delete(
  '/:id/unfollow',
  authenticate,
  followControllers.unfollowUserController
);

userRouter.get('/:id', authenticate, userController.getUserInfoController);

export default userRouter;
