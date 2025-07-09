import sequelize from '../db/sequelize.js';
import {seedUsers} from './seedUsers.js';
import {seedCategories} from './seedCategories.js';

const seed = async () => {
  await sequelize.sync({force: true});
  await seedCategories();
  await seedUsers();
};

seed();