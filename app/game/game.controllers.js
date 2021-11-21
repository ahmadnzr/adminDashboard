const asyncWrapper = require("../../middleware/asyncWrapper");
const { User, Room, Round, UserRounds } = require("../../models");
const {
  PLAYER_CHOICE_LIST,
  ROUND_ONE,
  ROUND_TWO,
  ROUND_THREE,
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
const ALREADY_PLAY = "ALREADY_PLAY";

const findUser = async (id) => {
  return await User.findByPk(id);
};

const findRound = async (id) => {
  return await Round.findOne({ where: { id }, include: User });
};

const findRoom = async (roomId, user) => {
  const room = await Room.findOne({
    where: { id: roomId },
    include: [{ model: Round, include: User }, { model: User }],
  });
  if (!room) return NOT_FOUND_ROOM;

  const user_room = room.Users.find((ur) => ur.id === user.id);
  if (!user_room) return NOT_FOUND_USER;

  return room;
};

const checkUserChoice = (choice) => {
  return PLAYER_CHOICE_LIST.includes(choice);
};

const fightingRoom = async (room, choice, user) => {
  const rounds = await room.getRounds();

  const round_one = rounds.find((round) => round.name === ROUND_ONE);
  const round_two = rounds.find((round) => round.name === ROUND_TWO);
  const round_three = rounds.find((round) => round.name === ROUND_THREE);

  if (round_one.isActive) {
    // TODO : logic to play game on round 1
  }

  if (round_two.isActive) {
    // TODO : logic to play game on round 2
  }

  if (round_three.isActive) {
    // TODO : logic to play game on round 3
  }
  // const user_round = await UserRounds.findOne({
  //   where: { userId: user.id, roundId: round_one.id },
  // });

  // const play = await UserRounds.update(
  //   { playerChoice: choice },
  //   {
  //     where: { userId: user.id, roundId: round_one.id, playerChoice: "" },
  //   }
  // );

  // if (play < 1) return ALREADY_PLAY;

  return round_one;
};

const fight = asyncWrapper(async (req, res) => {
  const user = await findUser(req.user.id);
  const { roomId, playerChoice } = req.body;
  const choice = playerChoice.toUpperCase();

  if (!roomId || !choice) {
    return res
      .status(400)
      .json(fieldRequired("roomId and playerChoice are required!"));
  }
  if (!checkUserChoice(choice)) {
    return res
      .status(400)
      .json(
        gameError(
          NOT_FOUND_CHOICE,
          `choice must be one of ${PLAYER_CHOICE_LIST} `
        )
      );
  }

  const room = await findRoom(roomId, user);
  if (room === NOT_FOUND_ROOM) {
    return res
      .status(404)
      .json(notFound("roomId not match with any room!", "/rooms"));
  }
  if (room === NOT_FOUND_USER) {
    return res
      .status(404)
      .json(gameError(NOT_FOUND_USER, "you are not player in room!"));
  }

  const fighting = await fightingRoom(room, choice, user);

  if (fighting === ALREADY_PLAY) {
    return res
      .status(403)
      .json(gameError(ALREADY_PLAY, "you have played on the round"));
  }

  return res.status(200).json(fighting);
});

const getRoomById = asyncWrapper(async (req, res) => {
  const user = req.user;
  // const user_round = await UserRounds.findOne({
  //   where: { userId: user.id, roundId: 1 },
  // });

  const user_round = await UserRounds.findAll({
    where: { roundId: 1 },
  });

  return res.status(200).json(user_round);
});

module.exports = {
  fight,
  getRoomById,
};
