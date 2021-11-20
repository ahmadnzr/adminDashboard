"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  UserRoom.init(
    {
      playerType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Player 1",
      },
    },
    {
      sequelize,
      modelName: "UserRooms",
    }
  );
  return UserRoom;
};
