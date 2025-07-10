import Category from '../db/Category.js';
import { getSeeder } from './utils.js';

export const seedCategories = getSeeder('categories.json', Category);
