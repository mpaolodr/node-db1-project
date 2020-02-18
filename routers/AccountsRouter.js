const router = require("express").Router();
const db = require("../data/dbConfig.js");

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const sortBy = req.query.sortby;
  const sortDir = req.query.sortdir;

  if (limit || sortBy || sortDir) {
    try {
      // limit query only
      if (limit && !sortBy && !sortDir) {
        const accts = await db("accounts").limit(limit);
        res.status(200).json(accts);
      }
      // sortby query only
      else if (sortBy && !limit) {
        const accts = await db("accounts").orderBy(
          sortBy,
          sortDir ? sortDir : "asc"
        );
        res.status(200).json(accts);
      }
      // limit and sortby and checking if sortdir exists
      else if (limit && sortBy) {
        const accts = await db("accounts")
          .limit(limit)
          .orderBy(sortBy, sortDir ? sortDir : "asc");
        res.status(200).json(accts);
      }
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

router.post("/", async (req, res) => {
  const accData = req.body;

  if (accData.name && accData.budget) {
    try {
      const [newAcc] = await db("accounts").insert(accData, "id");

      try {
        const createdAcc = await db("accounts").where("id", newAcc);

        res.status(200).json(createdAcc);
      } catch (err) {
        res.status(500).json({ errorMessage: "Account creation failed" });
      }
    } catch (err) {
      res.status(500).json({ errorMessage: err.message });
    }
  } else {
    res.status(400).json({ errorMessage: "Missing Fields" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (updatedData.name && updatedData.budget) {
    try {
      const updated = await db("accounts")
        .where("id", id)
        .update(updatedData);
      const [updatedAcc] = await db("accounts").where("id", id);
      res.status(200).json(updatedAcc);
    } catch (err) {
      res.status(500).json({ errorMessage: err.message });
    }
  } else {
    res.status(500).json({ errorMessage: "Missing Fields" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [removedAcc] = await db("accounts").where({ id: id });
    const successDel = await db("accounts")
      .where({ id: id })
      .del();

    res.status(200).json(removedAcc);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

module.exports = router;
