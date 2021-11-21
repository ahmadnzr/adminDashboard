const { User, Room, Round, UserRound } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const {
  fieldRequired,
  gameError,
  notFound,
} = require("../../utils/responseBuilder");
const RoomView = require("./room.views");
const {
  PLAYER_ONE,
  PLAYER_TWO,
  ROUND_ONE,
  ROUND_TWO,
  ROUND_THREE,
} = require("../../utils/gameChoiceConst");

const ALREADY_USER = "ALREADY_USER";
const FULL_ROOM = "FULL_ROOM";
const UNDEFINED_ROOM = "UNDEFINED_ROOM";

const findUser = async (id) => {
  return await User.findOne({ where: { id } });
};

const findRoom = async (id) => {
  return await Room.findOne({
    where: { id },
    include: [{ model: User }, { model: Round }],
  });
};

const createRound = async (room, user) => {
  const round1 = await Round.create({ name: ROUND_ONE });
  const round2 = await Round.create({ name: ROUND_TWO });
  const round3 = await Round.create({ name: ROUND_THREE });

  await round1.addUser(user, { through: { playerChoice: "" } });
  await round2.addUser(user, { through: { playerChoice: "" } });
  await round3.addUser(user, { through: { playerChoice: "" } });

  await room.addRound(round1);
  await room.addRound(round2);
  await room.addRound(round3);

  return;
};

const addUserToRound = async (round, user) => {
  await round.addUser(user, { through: { playerChoice: "" } });
};

const createRoom = async (body, userId) => {
  const { name } = body;
  const user = await findUser(userId);

  const room = await Room.create({ name, max: 2, status: "Active" });
  await room.addUser(user, { through: { playerType: PLAYER_ONE } });
  await createRound(room, user);
  return room;
};

const checkRoom = async (roomId, player) => {
  const room = await findRoom(roomId);
  const user_room = room.Users;

  if (!room) return UNDEFINED_ROOM;

  const already = user_room.find((user) => user.id === player.id);
  if (already) return ALREADY_USER;

  if (room.Users.length === 2) return FULL_ROOM;

  await room.addUser(player, { through: { playerType: PLAYER_TWO } });
  return room;
};

const create = asyncWrapper(async (req, res) => {
  const player1 = req.user;
  const { name } = req.body;

  if (!name) return res.status(400).json(fieldRequired("name is required!"));

  const room = await createRoom(req.body, player1.id);

  const response = new RoomView(await findRoom(room.id));

  return res.status(201).json(response);
});

const join = asyncWrapper(async (req, res) => {
  const player = await findUser(req.user.id);
  const { roomId } = req.body;

  if (!roomId)
    return res.status(400).json(fieldRequired("roomId is required!"));

  const room = await checkRoom(roomId, player);

  if (room === UNDEFINED_ROOM) {
    return res
      .status(404)
      .json(notFound("roomId not match with any room!", "/rooms"));
  }

  if (room === ALREADY_USER) {
    return res
      .status(403)
      .json(gameError(ALREADY_USER, "you have already join !"));
  }

  if (room == FULL_ROOM) {
    return res
      .status(403)
      .json(gameError(FULL_ROOM, "can't join, room is full !"));
  }

  room.Rounds.map(async (round) => {
    return await addUserToRound(round, player);
  });

  const response = new RoomView(await findRoom(room.id));

  return res.status(200).json(response);
});

const getAll = asyncWrapper(async (req, res) => {
  const rooms = await Room.findAll({
    include: [{ model: Round, include: User }],
  });

  return res.status(200).json(rooms);
});

module.exports = { create, getAll, join };
