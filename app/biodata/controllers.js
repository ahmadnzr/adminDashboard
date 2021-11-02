const { User, Biodatas } = require("../../models");
const asyncWrapper = require("../middleware/asyncWrapper");
const { success, fail, response } = require("../middleware/responseBuilder");

const checkBiodata = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const biodata = await Biodatas.findAll({ where: { id: n } });
  return biodata;
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
  const { username, password, fullname, email, age, gender, imgUrl } = req.body;

  if (!username || !password) {
    return res.status(400).json(fail("username and password are required!"));
  }
  const biodata = await Biodatas.create({
    fullname,
    email,
    age,
    gender,
    imgUrl,
  });

  const createUser = await User.create({
    username,
    password,
    biodataId: biodata.id,
  });
  const user = await User.findAll({
    attributes: ["id", "username", "password"],
    where: { id: createUser.id },
    include: { model: Biodatas },
  });
  return res.status(200).json(success(user));
});

const updateBiodata = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { fullname, email, age, gender, imgUrl } = req.body;
  const cBiodata = await checkBiodata(id);
  if (cBiodata.length < 1)
    return res.status(404).json(fail(`Biodata with id '${id}' is not found!`));

  await Biodatas.update(
    {
      fullname,
      email,
      age,
      gender,
      imgUrl,
    },
    { where: { id } }
  );

  const biodata = await Biodatas.findAll({ where: { id } });

  return res.status(200).json(success(biodata));
});

const deleteBiodata = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const cBiodata = await checkBiodata(id);
  if (cBiodata.length < 1)
    return res.status(404).json(fail(`Biodata with id '${id}' is not found!`));

  await Biodatas.update(
    {
      fullname: null,
      email: null,
      age: null,
      gender: null,
      imgUrl: null,
    },
    { where: { id } }
  );

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
