import { DataTypes } from "sequelize";

import sequelize from "./sequelize.js";

const Recipe = sequelize.define("recipe", {});

// Recipe.sync({ alter: true });

export default Recipe;
