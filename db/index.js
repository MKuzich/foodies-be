import User from './User.js';
import Follow from './Follow.js';
import Recipe from './Recipe.js';
import Ingredient from './Ingredient.js';
import RecipeIngredient from './RecipeIngredient.js';
import Category from './Category.js';
import Area from './Area.js';
// import Testimonial from './Testimonial.js';

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

Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: 'recipeId',
  otherKey: 'ingredientId',
  as: 'ingredientFilter',
});

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: 'ingredientId',
  otherKey: 'recipeId',
});

Recipe.hasMany(RecipeIngredient, {
  foreignKey: 'recipeId',
  as: 'recipeIngredients',
  onDelete: 'CASCADE',
  hooks: true,
});

RecipeIngredient.belongsTo(Recipe, {
  foreignKey: 'recipeId',
  as: 'recipe',
});

Recipe.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Category.hasMany(Recipe, {
  foreignKey: 'categoryId',
  as: 'recipes',
});

Recipe.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

User.hasMany(Recipe, {
  foreignKey: 'ownerId',
  as: 'recipes',
});

Recipe.belongsTo(Area, {
  foreignKey: 'areaId',
  as: 'area',
});

Area.hasMany(Recipe, {
  foreignKey: 'areaId',
  as: 'recipes',
});

User.belongsToMany(Recipe, {
  through: 'user_favorites',
  as: 'favoriteRecipes',
  foreignKey: 'userId',
  otherKey: 'recipeId',
});

Recipe.belongsToMany(User, {
  through: 'user_favorites',
  as: 'usersWhoFavorited',
  foreignKey: 'recipeId',
  otherKey: 'userId',
});

// User.hasMany(Testimonial, { foreignKey: 'owner' });
// Testimonial.belongsTo(User, { foreignKey: 'owner', as: 'user' });

// Recipe.hasMany(Testimonial, { foreignKey: 'recipeId' });
// Testimonial.belongsTo(Recipe, { foreignKey: 'recipeId' });

export { User, Follow, Recipe, Ingredient, RecipeIngredient, Category, Area };
