import User from '../db/User.js';
import bcrypt from 'bcrypt';
import {extractedSeedFile} from './utils.js';
import {hashPassword} from "../helpers/hash.js";

export async function seedUsers() {
  try {
    const data = await extractedSeedFile('users.json');
    const usersData = JSON.parse(data);

    const hashedUsers = await Promise.all(
        usersData.map(async user => ({
          ...user,
          password: await hashPassword(user.password),
        }))
    );

    await User.bulkCreate(hashedUsers);
    console.log('✅ Users seeded!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}