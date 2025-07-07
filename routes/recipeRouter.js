import express from "express";
import authenticate from "../middlewares/authenticate.js";
import controllers from "../controllers/recipeController.js";
import { updateStatusSchema } from "../schemas/contactsSchemas.js";

const recipeRouter = express.Router();
recipeRouter.use(authenticate);

recipeRouter.get("/", controllers.getAllRecipes);
recipeRouter.patch(
  "/:id/favorite",
  validateBody(updateStatusSchema),
  controllers.updateRecipeStatus
);

export default recipeRouter;
