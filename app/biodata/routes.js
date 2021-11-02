const {
  getBiodata,
  updateBiodata,
  deleteBiodata,
  getBiodataById,
  getBiodataByUserId,
  createBiodata,
} = require("./controllers");

const router = require("express").Router();

router.get("/biodatas", getBiodata);
router.post("/biodatas", createBiodata);
router.get("/users/:userId/biodata", getBiodataByUserId);
router.put("/biodatas/:id", updateBiodata);
router.delete("/biodatas/:id", deleteBiodata);

module.exports = router;
