const router = require("express").Router();
const db = require("../data/dbConfig.js");

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const sortBy = req.query.sortby;
  const sortDir = req.query.sortdir;

  if (req.query) {
    try {
      const accts = await db("accounts")
        .limit(limit)
        .orderBy(sortBy, sortDir);
      res.status(200).json(accts);
    } catch (err) {
      res.status(500).json({ errorMessage: err.message });
    }
  } else {
    try {
      const accts = await db("accounts");
      res.status(200).json(accts);
    } catch (err) {
      res.status(500).json({ errorMessage: err.message });
    }
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [acct] = await db("accounts").where("id", id);

    if (acct) {
      res.status(200).json(acct);
    } else {
      res.status(500).json({ errorMessage: "Account not found" });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: "ID not valid" });
  }
});

module.exports = router;
