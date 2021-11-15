const { User, Biodatas } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { success, fail, response } = require("../../middleware/responseBuilder");

const checkBiodata = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await Biodatas.findByPk(n);
};

const findUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await User.findByPk(n);
};

const getBiodata = asyncWrapper(async (req, res) => {
  const biodata = await Biodatas.findAll({ order: [["updatedAt", "DESC"]] });
  return res.status(200).json(success(biodata));
});

const getBiodataByUserId = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findAll({
    include: { model: Biodatas },
    attributes: ["id"],
    where: { id: userId },
  });

  const biodata = user[0].Biodata;
  return res.status(200).json(success([biodata]));
});

const createBiodata = asyncWrapper(async (req, res) => {
  const { fullname, email, age, gender, imgUrl, userId } = req.body;

  if (!userId) return res.status(400).json(fail("userId is required!"));

  const user = await findUser(userId);
  if (!user)
    return res.status(404).json(fail(`User with id '${userId}' is not found!`));

  const biodata = await Biodatas.create({
    fullname,
    email,
    age,
    gender,
    imgUrl,
    userId,
  });

  return res.status(200).json(success(biodata));
});

const updateBiodata = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { fullname, email, age, gender, imgUrl } = req.body;

  const biodata = await checkBiodata(id);
  if (!biodata)
    return res.status(404).json(fail(`Biodata with id '${id}' is not found!`));

  await biodata.update({
    fullname,
    email,
    age,
    gender,
    imgUrl,
  });

  return res.status(200).json(success(biodata));
});

const deleteBiodata = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const biodata = await checkBiodata(id);
  if (!biodata)
    return res.status(404).json(fail(`Biodata with id '${id}' is not found!`));

  await biodata.update({
    fullname: null,
    email: null,
    age: null,
    gender: null,
    imgUrl: null,
  });

  return res
    .status(200)
    .json(response(`User biodata with id '${id}' is deleted!`));
});

module.exports = {
  getBiodata,
  getBiodataByUserId,
  createBiodata,
  updateBiodata,
  deleteBiodata,
};
