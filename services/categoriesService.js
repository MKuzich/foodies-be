import Category from '../db/Category.js';

export const getAllCategories = () => {
  return Category.findAll();
};
