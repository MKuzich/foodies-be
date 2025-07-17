import express from 'express';

import userController from '../controllers/userController.js';
import followControllers from '../controllers/followController.js';

import authenticate from '../middlewares/authenticate.js';
import validateId from '../middlewares/validateId.js';

import recipesControllers from '../controllers/recipeController.js';

const userRouter = express.Router();

/**
 * @swagger
 * /users/following:
 *   get:
 *     summary: Get list of users the current user is following
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of followed users
 *       401:
 *         description: Unauthorized
 */
userRouter.get(
  '/following',
  authenticate,
  followControllers.getFollowingController
);

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     summary: Get list of followers for the specified user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       avatarURL:
 *                         type: string
 *                       ownRecipes:
 *                         type: integer
 *                       popularRecipes:
 *                         type: array
 *                         example: []
 *                       isFollowing:
 *                         type: boolean
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: User not found
 */
userRouter.get(
  '/:id/followers',
  authenticate,
  validateId,
  followControllers.getFollowersController
);

/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     summary: Follow the specified user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Followed successfully
 *       400:
 *         description: Cannot follow yourself
 *       404:
 *         description: User not found
 *       409:
 *         description: Already following this user
 */
userRouter.post(
  '/:id/follow',
  authenticate,
  validateId,
  followControllers.followUserController
);

/**
 * @swagger
 * /users/{id}/unfollow:
 *   delete:
 *     summary: Unfollow the specified user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *       404:
 *         description: Not following this user or user not found
 */
userRouter.delete(
  '/:id/unfollow',
  authenticate,
  validateId,
  followControllers.unfollowUserController
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatarURL:
 *                   type: string
 *                 createdCount:
 *                   type: integer
 *                 followersCount:
 *                   type: integer
 *                 followingCount:
 *                   type: integer
 *                 favoriteCount:
 *                   type: integer
 *       404:
 *         description: User not found
 */
userRouter.get('/:id', authenticate, userController.getUserInfoController);

/**
 * @swagger
 * /users/{id}/recipes:
 *   get:
 *     summary: Get recipes created by the specified user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of recipes
 *       404:
 *         description: User not found
 */
userRouter.get(
  '/:id/recipes',
  authenticate,
  validateId,
  recipesControllers.getUserRecipes
);

export default userRouter;
