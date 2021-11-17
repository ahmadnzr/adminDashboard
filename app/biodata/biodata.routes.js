const {
  getBiodata,
  updateBiodata,
  deleteBiodata,
  getBiodataByUserId,
} = require("./biodata.controllers");

const router = require("express").Router();

router.get("/biodatas", getBiodata);
router.get("/users/:userId/biodata", getBiodataByUserId);
router.put("/users/:userId/biodata", updateBiodata);
router.delete("/users/:userId/biodata", deleteBiodata);

module.exports = router;
