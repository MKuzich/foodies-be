import fs from 'fs/promises';
import path from 'path';

export async function extractedSeedFile(filename) {
  try {
    const data = await fs.readFile(
      path.resolve('seeders', 'data', filename),
      'utf8'
    );
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file: ${filename}`, error);
  }
}

export const updateData = (filename, data) =>
  fs.writeFile(
    path.resolve('seeders', 'data', filename),
    JSON.stringify(data, null, 2)
  );

export const getSeeder = (fileName, model, callback) => {
  return async () => {
    try {
      const parsedData = await extractedSeedFile(fileName);
      console.log('PARSED DATA:');

      let processedData = parsedData;
      if (callback) {
        processedData = await callback(parsedData);
      }

      await model.bulkCreate(processedData);
      console.log(`✅ ${model.getTableName().toUpperCase()} seeded!`);
    } catch (error) {
      console.error(`❌ Error seeding ${model.getTableName()}:`, error);
    }
  };
};

export const getSeederWithData = (data, model, callback) => {
  return async () => {
    try {
      let processedData = data;
      if (callback) {
        processedData = await callback(parsedData);
      }

      await model.bulkCreate(processedData);
      console.log(`✅ ${model.getTableName().toUpperCase()} seeded!`);
    } catch (error) {
      console.error(`❌ Error seeding ${model.getTableName()}:`, error);
    }
  };
};
