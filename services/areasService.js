import Area from '../db/Area.js';

export const getAllAreas = () => {
  return Area.findAll();
};
