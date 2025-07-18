import express from 'express';

import authController from '../controllers/authController.js';
import userSchemas from '../schemas/userSchemas.js';
import validateBody from '../decorators/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import { AVATAR_FIELD } from '../constants/files.js';

const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'GoIT'
 *               email:
 *                 type: string
 *                 example: 'goit@gmail.com'
 *               password:
 *                 type: string
 *                 example: 'test@gmail.com'
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTUsImlhdCI6MTc1MjY4Njc2MywiZXhwIjoxNzUyNzczMTYzfQ.640l2QP0qf8E_wuuqmebYMDsV2ySpn-l9xRi2FkUnPo"
 *               user:
 *                 id: 1
 *                 name: "GoIT"
 *                 email: "goit@gmail.com"
 *       400:
 *         description: Validation error
 */
authRouter.post(
  '/register',
  validateBody(userSchemas.authRegisterSchema),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: goit@gmail.com
 *               password:
 *                 type: string
 *                 example: 'test@gmail.com'
 *     responses:
 *       200:
 *         description: Successfully log in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *             example:
 *                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTUsImlhdCI6MTc1MjY4Njc2MywiZXhwIjoxNzUyNzczMTYzfQ.640l2QP0qf8E_wuuqmebYMDsV2ySpn-l9xRi2FkUnPo"
 *                user:
 *                  id: 1
 *                  name: "GoIT"
 *                  email: "goit@gmail.com"
 *       401:
 *         description: Invalid credentials
 */
authRouter.post(
  '/login',
  validateBody(userSchemas.authLoginSchema),
  authController.login
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */
authRouter.post('/logout', authenticate, authController.logout);

/**
 * @swagger
 * /auth/current:
 *   get:
 *     summary: Get currently logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: "GoIT"
 *               email: "goit@gmail.com"
 *               avatarURL: null
 *       401:
 *         description: Unauthorized
 */
authRouter.get('/current', authenticate, authController.getCurrent);

/**
 * @swagger
 * /auth/avatars:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *        description: Avatar updated
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatarUrl:
 *                   type: string
 *                   example: https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e37f5.png
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
authRouter.patch(
  '/avatars',
  authenticate,
  upload.single(AVATAR_FIELD),
  authController.updateAvatar
);

export default authRouter;
