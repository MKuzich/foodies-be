import User from './User.js';
import Follow from './Follow.js';
import Recipe from './Recipe.js';
import Ingredient from './Ingredient.js';
import RecipeIngredient from './RecipeIngredient.js';

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

Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: 'recipeId',
  otherKey: 'ingredientId',
});

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: 'ingredientId',
  otherKey: 'recipeId',
});

export { User, Follow, Recipe, Ingredient, RecipeIngredient };
