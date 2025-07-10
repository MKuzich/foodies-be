import express from 'express';
import areasControllers from '../controllers/areasController.js';

const areasRouter = express.Router();

areasRouter.get('/', areasControllers.getAllAreas);

export default areasRouter;
