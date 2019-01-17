const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/users");
const { handle405 } = require("../errors");

usersRouter
  .route("/")
  .get(getUsers)
  .all(handle405);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
