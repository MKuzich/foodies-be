import { Recipe, RecipeIngredient } from '../db/index.js';
import { extractedSeedFile, getSeederWithData } from './utils.js';

const seedRecipes = async () => {
  const data = await extractedSeedFile('recipes.json');
  let recipesData = [];
  let recipeIngredientsData = [];
  data.forEach((recipe) => {
    const { ingredients, ...recipeData } = recipe;
    const randomUserId = Math.floor(Math.random() * 7) + 1;
    recipesData.push({ ...recipeData, ownerId: randomUserId });
    ingredients.forEach(({ id, measure }) => {
      recipeIngredientsData.push({
        recipeId: recipe.id,
        ingredientId: id,
        measure: measure,
      });
    });
  });

  const seedRecipe = getSeederWithData(recipesData, Recipe);

  const seedRecipeIngredient = getSeederWithData(
    recipeIngredientsData,
    RecipeIngredient,
    null,
    false
  );

  await seedRecipe();
  await seedRecipeIngredient();
};

export { seedRecipes };
