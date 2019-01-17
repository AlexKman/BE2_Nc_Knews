const connection = require('../db/connection');

exports.getUsers = (req, res, next) => {
  connection
    .select('*')
    .from('users')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  connection
    .select('*')
    .from('users')
    .where('username', req.params.username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, message: 'User not found' });
      res.status(200).send({ user });
    })
    .catch(next);
};
