const router = require("express").Router();
const db = require("../data/dbConfig.js");

router.get("/", async (req, res) => {
  try {
    const accounts = await db("accounts");
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

module.exports = router;
