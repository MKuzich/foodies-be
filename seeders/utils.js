import fs from 'fs/promises';
import path from 'path';

export async function extractedSeedFile(filename) {
  try {
    return await fs.readFile(path.resolve('seeders', 'data', filename), 'utf8');
  } catch (error) {
    console.error(`❌ Error reading file: ${filename}`, error);
  }
}

export const getSeeder = (fileName, model, callback) => {
  return async () => {
    try {
      const data = await extractedSeedFile(fileName);
      const parsedData = JSON.parse(data);

      let processedData = parsedData;
      if (callback) {
        processedData = await callback(parsedData)
      }

      await model.bulkCreate(processedData);
      console.log(`✅ ${model.getTableName().toUpperCase()} seeded!`);
    } catch (error) {
      console.error(`❌ Error seeding ${model.getTableName()}:`, error);
    }
  }
};
