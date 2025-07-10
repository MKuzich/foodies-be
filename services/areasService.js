import Area from '../db/Areas.js';

export const getAllAreas = () => {
  return Area.findAll();
};
