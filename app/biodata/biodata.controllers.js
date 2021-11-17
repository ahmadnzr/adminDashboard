const { User, Biodatas } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { notFound } = require("../../utils/responseBuilder");
const BiodataViews = require("./biodata.views");

const findBiodata = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await Biodatas.findOne({ where: { userId: n } });
};

const getBiodata = asyncWrapper(async (req, res) => {
  const biodatas = await Biodatas.findAll({ order: [["updatedAt", "DESC"]] });

  const response = biodatas.map((bio) => {
    return new BiodataViews(bio);
  });

  return res.status(200).json(response);
});

const getBiodataByUserId = asyncWrapper(async (req, res) => {
  const id = req.params.userId;

  const biodata = await findBiodata(id);

  if (!biodata) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  const response = new BiodataViews(biodata);

  return res.status(200).json(response);
});

const updateBiodata = asyncWrapper(async (req, res) => {
  const id = req.params.userId;

  const { fullname, email, age, gender, imgUrl } = req.body;

  const biodata = await findBiodata(id);

  if (!biodata) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  await biodata.update({
    fullname,
    email,
    age,
    gender,
    imgUrl,
  });
  const response = new BiodataViews(biodata);

  return res.status(200).json(response);
});

const deleteBiodata = asyncWrapper(async (req, res) => {
  const id = req.params.userId;

  const biodata = await findBiodata(id);

  if (!biodata) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  await biodata.update({
    fullname: null,
    email: null,
    age: null,
    gender: null,
    imgUrl: null,
  });
  const response = new BiodataViews(biodata);

  return res.status(200).json(response);
});

module.exports = {
  getBiodata,
  getBiodataByUserId,
  updateBiodata,
  deleteBiodata,
};
