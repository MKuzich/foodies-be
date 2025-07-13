import express from 'express';
import areasControllers from '../controllers/areasController.js';

const areasRouter = express.Router();

/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Get list of geographic areas for recipes
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: List of areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error
 */
areasRouter.get('/', areasControllers.getAllAreas);

export default areasRouter;
