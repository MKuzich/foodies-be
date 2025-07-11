import sequelize from '../db/sequelize.js';
import { seedUsers } from './seedUsers.js';
import { seedCategories } from './seedCategories.js';
import { seedAreas } from './seedAreas.js';
import { seedIngredients } from './seedIngredients.js';
import { seedTestimonials } from './seedTestimonials.js';
import { seedRecipes } from './seedRecipes.js';

const seed = async () => {
  await sequelize.sync({ force: true });
  await seedUsers();
  await seedCategories();
  await seedAreas();
  await seedIngredients();
  await seedTestimonials();
  await seedRecipes();
};

seed();
