import { DataTypes } from "sequelize";

import sequelize from "./sequelize.js";

const User = sequelize.define("user", {});

// User.sync({ alter: true });

export default User;
