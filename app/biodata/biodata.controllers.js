const { User, Biodatas } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { notFound } = require("../../middleware/responseBuilder");

const findBiodata = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await Biodatas.findOne({where: {userId: n}});
};

const getBiodata = asyncWrapper(async (req, res) => {
  const biodata = await Biodatas.findAll({ order: [["updatedAt", "DESC"]] });

  return res.status(200).json(biodata);
});

const getBiodataByUserId = asyncWrapper(async (req, res) => {
  const id = req.params.userId;

  const biodata = await findBiodata(id)

  if (!biodata) {
    return res.status(404).json(notFound(`user id '${id}' undefined`,'/users'));
  }

  return res.status(200).json(biodata);
});

const updateBiodata = asyncWrapper(async (req, res) => {
  const id = req.params.userId;

  const { fullname, email, age, gender, imgUrl } = req.body;

  const biodata = await findBiodata(id)

  if (!biodata) {
    return res.status(404).json(notFound(`user id '${id}' undefined`,'/users'));
  }

  await biodata.update({
    fullname,
    email,
    age,
    gender,
    imgUrl,
  });

  return res.status(200).json(biodata);
});

const deleteBiodata = asyncWrapper(async (req, res) => {
  const id = req.params.userId;

  const biodata = await findBiodata(id)

  if (!biodata) {
    return res.status(404).json(notFound(`user id '${id}' undefined`,'/users'));
  }

  await biodata.update({
    fullname:null,
    email:null,
    age:null,
    gender:null,
    imgUrl:null,
  });

  return res.status(200).json(biodata);
});

module.exports = {
  getBiodata,
  getBiodataByUserId,
  updateBiodata,
  deleteBiodata,
};
