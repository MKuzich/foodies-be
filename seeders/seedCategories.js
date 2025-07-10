import Category from '../db/Category.js';
import { extractedSeedFile } from './utils.js';

export async function seedCategories() {
  try {
    const data = await extractedSeedFile('categories.json');
    const categoriesData = JSON.parse(data);

    await Category.bulkCreate(categoriesData);
    console.log('✅ Categories seeded!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
}
