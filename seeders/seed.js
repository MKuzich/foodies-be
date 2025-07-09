import fs from 'fs/promises';
import path from 'path';
import Category from '../db/Category.js';
import sequelize from '../db/sequelize.js';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    const data = await fs.readFile(
      path.resolve('seeders', 'categories.json'),
      'utf8'
    );
    const categoriesData = JSON.parse(data);
    await Category.bulkCreate(categoriesData);

    console.log('✅ Categories seeded!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seed();
