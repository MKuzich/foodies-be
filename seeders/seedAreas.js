import Area from '../db/Areas.js';
import { getSeeder } from './utils.js';

export const seedAreas = getSeeder('areas.json', Area);
