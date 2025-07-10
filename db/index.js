import User from './User.js';
import Follow from './Follow.js';

Follow.belongsTo(User, { as: 'follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'following', foreignKey: 'followingId' });

User.belongsToMany(User, {
  as: 'Followers',
  through: Follow,
  foreignKey: 'followingId',
  otherKey: 'followerId',
});

User.belongsToMany(User, {
  as: 'Following',
  through: Follow,
  foreignKey: 'followerId',
  otherKey: 'followingId',
});

export { User, Follow };
