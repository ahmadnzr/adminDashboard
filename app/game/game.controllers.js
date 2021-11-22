const { Op } = require("sequelize");
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
const GAME_OVER = "GAME_OVER";

const findUser = async (id) => {
  return await User.findByPk(id);
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

const findRound = async (roundId) => {
  return await Round.findOne({ where: { id: roundId }, include: User });
};

const checkUserChoice = (choice) => {
  return PLAYER_CHOICE_LIST.includes(choice);
};

const alreadyPlay = async (round, userId) => {
  return await UserRounds.findOne({
    where: {
      playerChoice: { [Op.ne]: "" },
      roundId: round.id,
      userId,
    },
  });
};

const submitGame = async (round, userId, choice) => {
  return await UserRounds.update(
    { playerChoice: choice },
    { where: { roundId: round.id, userId } }
  );
};

const changeRoundStatus = async (lastRound, newRound) => {
  const userRound = await lastRound.getUsers();
  const checkGameRound = userRound.filter(
    (user) => user.UserRounds.playerChoice !== ""
  );

  if (checkGameRound.length > 1) {
    await lastRound.update({ isActive: false });
    await newRound.update({ isActive: true });
  }
};

const generateResult = async (lastRound, room) => {
  const userRound = await lastRound.getUsers();
  const checkGameRound = userRound.filter(
    (user) => user.UserRounds.playerChoice !== ""
  );

  if (checkGameRound.length > 1) {
    await lastRound.update({ isActive: false });
    await room.update({ isActive: false });
    return await Room.findOne({
      where: { id: room.id },
    });
  }

  return false;
};

const fightingRoom = async (room, choice, user) => {
  const rounds = await room.getRounds();

  const round_one = rounds.find((round) => round.name === ROUND_ONE);
  const round_two = rounds.find((round) => round.name === ROUND_TWO);
  const round_three = rounds.find((round) => round.name === ROUND_THREE);

  await changeRoundStatus(round_one, round_two);
  await changeRoundStatus(round_two, round_three);

  const results = await generateResult(round_three, room);
  if (results) return GAME_OVER;

  if (round_one.isActive) {
    if (await alreadyPlay(round_one, user.id)) return ALREADY_PLAY;
    await submitGame(round_one, user.id, choice);
    return await findRound(round_one.id);
  }

  if (round_two.isActive) {
    if (await alreadyPlay(round_two, user.id)) return ALREADY_PLAY;
    await submitGame(round_two, user.id, choice);
    return await findRound(round_two.id);
  }

  if (round_three.isActive) {
    if (await alreadyPlay(round_three, user.id)) return ALREADY_PLAY;
    await submitGame(round_three, user.id, choice);
    return await findRound(round_three.id);
  }
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
      .status(403)
      .json(gameError(NOT_FOUND_USER, "you are not player in room!"));
  }

  const fighting = await fightingRoom(room, choice, user);

  if (fighting === ALREADY_PLAY) {
    return res
      .status(403)
      .json(
        gameError(
          ALREADY_PLAY,
          "you have played on the round, please wait for player two resposne"
        )
      );
  }

  if (fighting === GAME_OVER) {
    return res
      .status(200)
      .json(
        gameError(
          GAME_OVER,
          "game is over, check results on /game/result/:roomId"
        )
      );
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
