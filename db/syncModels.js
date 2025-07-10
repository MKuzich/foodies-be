import { User, Follow } from './index.js';

const syncAll = async () => {
  await User.sync({ alter: true });
  await Follow.sync({ alter: true });
};

syncAll()
  .then(() => console.log('All models synced'))
  .catch(console.error);

// to run: node db/syncModels.js
