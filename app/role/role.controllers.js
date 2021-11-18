const asyncWrapper = require("../../middleware/asyncWrapper");
const { Role } = require("../../models");
const { fieldRequired, notFound } = require("../../utils/responseBuilder");
const RoleView = require("./role.views");

const checkRole = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await Role.findOne({
    where: { id: n },
  });
};

const addRole = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json(fieldRequired("name is required"));

  const role = await Role.create({ name });

  const response = new RoleView(role);

  return res.status(201).json(response);
});

const getRoles = asyncWrapper(async (req, res) => {
  const roles = await Role.findAll();

  const response = roles.map((role) => {
    return new RoleView(role);
  });

  return res.status(200).json(response);
});

const updateRole = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const role = await checkRole(id);

  if (!role) {
    return res
      .status(404)
      .json(notFound(`role id '${id}' undefined`, "/roles"));
  }

  if (!name) return res.status(400).json(fieldRequired("name is required"));

  await role.update({ name });
  const response = new RoleView(role);

  return res.status(200).json(response);
});

const deleteRole = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const role = await checkRole(id);

  if (!role) {
    return res
      .status(404)
      .json(notFound(`role id '${id}' undefined`, "/roles"));
  }

  await role.destroy();

  return res.status(200).json({});
});

module.exports = {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
};
