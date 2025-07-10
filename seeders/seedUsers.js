import User from '../db/User.js';
import { getSeeder } from './utils.js';
import { hashPassword } from '../helpers/hash.js';

const getHashedUsers = async (usersData) =>
  await Promise.all(
    usersData.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password),
    }))
  );

export const seedUsers = getSeeder('users.json', User, getHashedUsers);
