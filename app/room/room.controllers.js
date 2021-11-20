const { User, Room } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { fieldRequired } = require("../../utils/responseBuilder");
const RoomView = require("./room.views");

const findUser = async (id) => {
  return await User.findOne({ where: { id } });
};

const findRoom = async (id) => {
  return await Room.findOne({ where: { id }, include: User });
};

const createRoom = async (body, userId) => {
  const { name } = body;
  const user = await findUser(userId);

  const room = await Room.create({ name, max: 2, status: "Active" });
  await room.addUser(user, { throug: { playerType: "Player 1" } });
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

const getAll = asyncWrapper(async (req, res) => {
  const rooms = await Room.findAll({ include: User });

  const response = rooms.map((room) => {
    return new RoomView(room);
  });

  return res.status(200).json(response);
});

module.exports = { create, getAll };
