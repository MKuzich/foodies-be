import User from './User.js';
import Follow from './Follow.js';
import Recipe from './Recipe.js';
import Ingredient from './Ingredient.js';
import RecipeIngredient from './RecipeIngredient.js';
import Testimonial from './Testimonial.js';

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
  as: 'ingredients',
});

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: 'ingredientId',
  otherKey: 'recipeId',
});
User.hasMany(Testimonial, { foreignKey: 'owner' });
Testimonial.belongsTo(User, { foreignKey: 'owner', as: 'user' });

Recipe.hasMany(Testimonial, { foreignKey: 'recipeId' });
Testimonial.belongsTo(Recipe, { foreignKey: 'recipeId' });


export { User, Follow, Recipe, Ingredient, RecipeIngredient, Testimonial };
