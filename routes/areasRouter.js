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
 *         description: List of area
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Areas'
 *       500:
 *         description: Server error
 */
areasRouter.get('/', areasControllers.getAllAreas);

export default areasRouter;
