import Area from '../db/Area.js';
import { getSeeder } from './utils.js';

export const seedAreas = getSeeder('areas.json', Area);
