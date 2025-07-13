import fs from 'fs/promises';
import path from 'path';
import sequelize from '../db/sequelize.js';

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
      await sequelize.query(`
        SELECT setval(pg_get_serial_sequence('"${model.getTableName()}"', 'id'), (SELECT MAX(id) FROM "${model.getTableName()}"));
      `);
      console.log(`✅ ${model.getTableName().toUpperCase()} seeded!`);
    } catch (error) {
      console.error(`❌ Error seeding ${model.getTableName()}:`, error);
    }
  };
};

export const getSeederWithData = (data, model, callback, isUpdateId = true) => {
  return async () => {
    try {
      let processedData = data;
      if (callback) {
        processedData = await callback(parsedData);
      }

      await model.bulkCreate(processedData);
      if (isUpdateId) {
        await sequelize.query(`
        SELECT setval(pg_get_serial_sequence('"${model.getTableName()}"', 'id'), (SELECT MAX(id) FROM "${model.getTableName()}"));
      `);
      }
      console.log(`✅ ${model.getTableName().toUpperCase()} seeded!`);
    } catch (error) {
      console.error(`❌ Error seeding ${model.getTableName()}:`, error);
    }
  };
};
