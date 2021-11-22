"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "UserRooms",
        foreignKey: "roomId",
      });

      this.hasMany(models.Round, { foreignKey: "roomId" });
    }
  }
  Room.init(
    {
      name: DataTypes.STRING,
      max: DataTypes.INTEGER,
      winner: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
