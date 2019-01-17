const connection = require("../db/connection");

exports.getUsers = (req, res, next) => {
  connection
    .select("*")
    .from("users")
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  connection
    .select("*")
    .from("users")
    .where("username", req.params.username)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
