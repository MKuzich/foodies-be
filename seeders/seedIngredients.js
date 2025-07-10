import Ingredient from '../db/Ingredient.js';
import { getSeeder } from './utils.js';

export const seedIngredients = getSeeder('ingredients.json', Ingredient);
