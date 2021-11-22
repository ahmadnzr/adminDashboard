const { Op } = require("sequelize");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { User, Room, Round, UserRounds, UserRooms } = require("../../models");
const {
  PLAYER_CHOICE_LIST,
  ROUND_ONE,
  ROUND_TWO,
  ROUND_THREE,
  PLAYER_ONE,
  PLAYER_TWO,
  KERTAS,
  DRAW,
  BATU,
  PLAYER_TWO_WIN,
  PLAYER_ONE_WIN,
  GUNTING,
  DRAW_POINT,
  WINNER_POINT,
  LOST_POINT,
} = require("../../utils/gameChoiceConst");
const {
  notFound,
  fieldRequired,
  gameError,
} = require("../../utils/responseBuilder");
const FightView = require("./fight.views");
const GameView = require("./game.views");
const RoundView = require("./round.view");
const UserHistoryView = require("./userHistory.views");

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

  if (!checkUserInRoom(room, user)) return NOT_FOUND_USER;

  return room;
};

const checkUserInRoom = (room, user) => {
  return room.Users.find((ur) => ur.id === user.id);
};

const findRound = async (roundId) => {
  return await Round.findOne({ where: { id: roundId }, include: User });
};

const findRoundByRoomId = async (roomId, name) => {
  return await Round.findOne({ where: { roomId, name }, include: User });
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
    await changeRoundResult(lastRound);
    await newRound.update({ isActive: true });
  }
};

const changeRoundResult = async (lastRound) => {
  const users_round = await lastRound.getUsers();
  const users_room = await UserRooms.findAll({
    where: { roomId: lastRound.roomId },
  });

  const player_one_room = users_room.find(
    (user) => user.playerType === PLAYER_ONE
  );
  const player_two_room = users_room.find(
    (user) => user.playerType === PLAYER_TWO
  );

  const player_one_round = users_round.find(
    (user) => user.id === player_one_room.userId
  );
  const player_two_round = users_round.find(
    (user) => user.id === player_two_room.userId
  );

  const player_one_choice = player_one_round.UserRounds.playerChoice;
  const player_two_choice = player_two_round.UserRounds.playerChoice;

  const result = findWinnerRound({ player_one_choice, player_two_choice });

  switch (result) {
    case DRAW:
      return await lastRound.update({
        playerOnePoint: DRAW_POINT,
        playerTwoPoint: DRAW_POINT,
        winner: DRAW,
        isActive: false,
      });
    case PLAYER_ONE_WIN:
      return await lastRound.update({
        playerOnePoint: WINNER_POINT,
        playerTwoPoint: LOST_POINT,
        winner: PLAYER_ONE,
        isActive: false,
      });
    case PLAYER_TWO_WIN:
      return await lastRound.update({
        playerOnePoint: LOST_POINT,
        playerTwoPoint: WINNER_POINT,
        winner: PLAYER_TWO,
        isActive: false,
      });
  }
};

const changeRoomResult = async (room) => {
  const rounds = await room.getRounds();

  const user_one_point = rounds.reduce((points, cPoint) => {
    return points + cPoint.playerOnePoint;
  }, 0);

  const user_two_point = rounds.reduce((points, cPoint) => {
    return points + cPoint.playerTwoPoint;
  }, 0);

  if (user_one_point > user_two_point) {
    await room.update({
      winner: PLAYER_ONE,
      isActive: false,
    });
    return await UserRooms.update(
      { isWinner: true, playerPoint: user_one_point },
      { where: { playerType: PLAYER_ONE, roomId: room.id } }
    );
  }

  if (user_one_point < user_two_point) {
    await room.update({
      winner: PLAYER_TWO,
      isActive: false,
    });
    return await UserRooms.update(
      { isWinner: true, playerPoint: user_two_point },
      { where: { playerType: PLAYER_ONE, roomId: room.id } }
    );
  }

  await room.update({
    winner: DRAW,
    isActive: false,
  });
  return await UserRooms.update(
    { playerPoint: user_two_point },
    { where: { roomId: room.id } }
  );
};

const findWinnerRound = ({ player_one_choice, player_two_choice }) => {
  if (player_one_choice === player_two_choice) return DRAW;

  if (player_one_choice === BATU)
    return player_two_choice === KERTAS ? PLAYER_TWO_WIN : PLAYER_ONE_WIN;

  if (player_one_choice === KERTAS)
    return player_two_choice === GUNTING ? PLAYER_TWO_WIN : PLAYER_ONE_WIN;

  if (player_one_choice === GUNTING)
    return player_two_choice === BATU ? PLAYER_TWO_WIN : PLAYER_ONE_WIN;
};

const generateResult = async (lastRound, room) => {
  const userRound = await lastRound.getUsers();
  const checkGameRound = userRound.filter(
    (user) => user.UserRounds.playerChoice !== ""
  );

  if (checkGameRound.length > 1) {
    await changeRoundResult(lastRound);
    await changeRoomResult(room);
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

  const response = new FightView(fighting);

  return res.status(200).json(response);
});

const getRoomById = asyncWrapper(async (req, res) => {
  const { roomId } = req.params;
  const user = req.user;

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

  const response = new GameView(room);

  return res.status(200).json(response);
});

const gameRound = asyncWrapper(async (req, res) => {
  const { roomId } = req.params;
  const user = req.user;

  const url = req.url.split("/")[4];
  let name;

  switch (url) {
    case "round-one":
      name = ROUND_ONE;
      break;
    case "round-two":
      name = ROUND_TWO;
      break;
    case "round-three":
      name = ROUND_THREE;
      break;
    default:
      break;
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
  const response = new RoundView(await findRoundByRoomId(roomId, name));
  return res.status(200).json(response);
});

const gameUserHistory = asyncWrapper(async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    include: [{ model: Room }],
  });

  const response = new UserHistoryView(user);

  return res.status(200).json(response);
});
module.exports = {
  fight,
  getRoomById,
  gameRound,
  gameUserHistory,
};
