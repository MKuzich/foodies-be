import sequelize from '../db/sequelize.js';
import { seedUsers } from './seedUsers.js';
import { seedCategories } from './seedCategories.js';
import { seedAreas } from './seedAreas.js';
import { seedIngredients } from './seedIngredients.js';

const seed = async () => {
  await sequelize.sync({ force: true });
  await seedCategories();
  await seedUsers();
  await seedAreas();
  await seedIngredients();
};

seed();
