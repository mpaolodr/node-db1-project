const express = require("express");
const AccountsRouter = require("../routers/AccountsRouter.js");

const server = express();

server.use(express.json());
server.use("/api/accounts", AccountsRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "is live!" });
});

module.exports = server;
