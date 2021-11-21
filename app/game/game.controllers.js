const asyncWrapper = require("../../middleware/asyncWrapper");
const { User, Room, Round, Sequelize } = require("../../models");
const {
  PLAYER_CHOICE_LIST,
  ROUND_ONE,
  WAITING_PLAYER_TWO,
  ROUND_TWO,
} = require("../../utils/gameChoiceConst");
const {
  notFound,
  fieldRequired,
  gameError,
} = require("../../utils/responseBuilder");
const GameView = require("./game.views");

const NOT_FOUND_ROOM = "NOT_FOUND_ROOM";
const NOT_FOUND_USER = "NOT_FOUND_USER";
const NOT_FOUND_CHOICE = "NOT_FOUND_CHOICE";

const findUser = async (id) => {
  return await User.findByPk(id);
};

const findRound = async (id) => {
  return await Round.findOne({ where: { id }, include: User });
};

const findRoom = async (roomId, user) => {
  const room = await Room.findOne({
    where: { id: 1 },
    include: [{ model: Round }, { model: User }],
  });
  if (!room) return NOT_FOUND_ROOM;

  const user_room = room.Users.find((ur) => ur.id === user.id);
  if (!user_room) return NOT_FOUND_USER;

  return user_room;
};

const findUserInRound = async (id) => {
  return await Round.findOne({
    where: { roomId: id },
    include: User,
  });
};

const createRound = async (roomId, user, choice) => {
  const round_room = await findUserInRound;
  const round = await Round.create({ roomId });
  await round.addUser(user, { through: { playerChoice: choice } });

  return round;
};

const checkUserChoice = (choice) => {
  return PLAYER_CHOICE_LIST.includes(choice);
};

const fight = asyncWrapper(async (req, res) => {
  const user = await findUser(req.user.id);
  const { roomId, playerChoice } = req.body;
  const choice = playerChoice.toUpperCase();

  if (!roomId || !choice)
    return res
      .status(400)
      .json(fieldRequired("roomId and playerChoice are required!"));
  if (!checkUserChoice(choice))
    return res
      .status(400)
      .json(
        gameError(
          NOT_FOUND_CHOICE,
          `choice must be one of ${PLAYER_CHOICE_LIST} `
        )
      );

  const room = await findRoom(roomId, user);
  if (room === NOT_FOUND_ROOM)
    return res
      .status(404)
      .json(notFound("roomId not match with any room!", "/rooms"));
  if (room === NOT_FOUND_USER)
    return res
      .status(404)
      .json(gameError(NOT_FOUND_USER, "you are not player in room!"));

  const round = await createRound(roomId, user, choice);

  const response = await findRound(round.id);
  return res.status(200).json(response);
});

const getRoomById = asyncWrapper(async (req, res) => {
  const round = await Room.findOne({
    where: { id: 1 },
    include: [{ model: Round, include: { model: User } }],
  });

  const response = new GameView(await findRound(1));

  return res.status(200).json(round);
});

module.exports = {
  fight,
  getRoomById,
};
