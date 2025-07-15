import sequelize from '../db/sequelize.js';
import { seedUsers } from './seedUsers.js';
import { seedCategories } from './seedCategories.js';
import { seedAreas } from './seedAreas.js';
import { seedIngredients } from './seedIngredients.js';
import { seedTestimonials } from './seedTestimonials.js';
import { seedRecipes } from './seedRecipes.js';
import { deleteAllImagesFromCloudinary } from '../helpers/fileStorage.js';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    await seedUsers();
    await seedCategories();
    await seedAreas();
    await seedIngredients();
    await seedRecipes();
    await seedTestimonials();
    console.log('✅ Seeding completed');

    await deleteAllImagesFromCloudinary();

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
