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
    where: { roomId: id },
    include: User,
  });
};

const createRound = async (roomId, user, choice) => {
  const round = await findRoomInRound(roomId);

  // TODO get length of round users, set max is 2
  const exiting_user =
    round?.Users.length < 1 ? round?.Users[0].id : round?.Users[1].id;
  const user_total = round?.Users.length;

  if (exiting_user !== user.id) {
    await round.addUser(user, { through: { playerChoice: choice } });
    return round;
  }

  if (user_total < 2) return WAITING_PLAYER_TWO;

  const newRound = await Round.create({ roomId, name: ROUND_TWO });
  await newRound.addUser(user, { through: { playerChoice: choice } });
  return newRound;
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
      .json(notFound("player choice is not in lists", PLAYER_CHOICE_LIST));
  }

  const room = await findRoom(roomId);
  if (!room) {
    return res.status(404).json(notFound("roomId not found", ""));
  }

  const user = await findUser(req.user.id);

  const round = await createRound(roomId, user, choice);

  if (round === WAITING_PLAYER_TWO) {
    return res
      .status(403)
      .json(gameError(WAITING_PLAYER_TWO, "wait for player 2 response !"));
  }

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
