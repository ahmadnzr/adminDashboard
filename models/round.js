"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "UserRounds",
        foreignKey: "roundId",
      });

      this.belongsTo(models.Room, { foreignKey: "roomId" });
    }
  }
  Round.init(
    {
      roomId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      playerOnePoint: DataTypes.INTEGER,
      playerTwoPoint: DataTypes.INTEGER,
      winner: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "Round",
    }
  );
  return Round;
};
