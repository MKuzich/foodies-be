import express from 'express';

import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import validateId from '../middlewares/validateId.js';

const userRouter = express.Router();

userRouter.get('/:id', authenticate, validateId, userController.getUserInfo);

export default userRouter;
