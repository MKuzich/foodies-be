import fs from 'fs/promises';
import path from 'path';

export async function extractedSeedFile(filename) {
  try {
    return await fs.readFile(path.resolve('seeders', 'data', filename), 'utf8');
  } catch (error) {
    console.error(`❌ Error reading file: ${filename}`, error);
  }
}