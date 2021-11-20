const asyncWrapper = require("../../middleware/asyncWrapper");
const { User, Room, Round, Sequelize } = require("../../models");
const {
  PLAYER_CHOICE_LIST,
  ROUND_ONE,
} = require("../../utils/gameChoiceConst");
const { notFound, fieldRequired } = require("../../utils/responseBuilder");
const GameView = require("./game.views");

const findUser = async (id) => {
  return await User.findByPk(id);
};

const findRound = async (id) => {
  return await Round.findOne({ where: { id }, include: User });
};

const findRoom = async (id) => {
  return await Room.findByPk(id);
};

const findRoomInRound = async (id) => {
  return await Round.findOne({
    where: { roomId: id }
  });
};

const createRound = async (roomId, user, choice) => {
  const room = await findRoomInRound(roomId);

  return await Round.create({ roomId, name: ROUND_ONE });
};

const checkUserChoice = (choice) => {
  return PLAYER_CHOICE_LIST.includes(choice);
};

const fight = asyncWrapper(async (req, res) => {
  const { roomId, playerChoice } = req.body;

  const choice = playerChoice.toUpperCase();
  if (!roomId || !choice)
    return res
      .status(400)
      .json(fieldRequired("roomId and playerChoice are required!"));

  if (!checkUserChoice(choice)) {
    return res
      .status(404)
      .json(notFound("player choice not found", PLAYER_CHOICE_LIST));
  }

  const room = await findRoom(roomId);
  if (!room) {
    return res.status(404).json(notFound("roomId not found", ""));
  }

  const user = await findUser(req.user.id);

  const round = await createRound(roomId);

  // TODO : System wait to wait player two response

  await round.addUser(user, { through: { choice } });

  const response = new GameView(await findRound(round.id));

  return res.status(200).json(response);
});

const getRoomById = asyncWrapper(async (req, res) => {
  const response = new GameView(await findRound(1));

  return res.status(200).json(response);
});

module.exports = {
  fight,
  getRoomById,
};
