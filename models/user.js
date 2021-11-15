"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Biodatas, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
      this.belongsToMany(models.Game, {
        through: "UserGames",
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      encryptedPassword: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
