const connection = require("./db/connection");
const jwt = require("jsonwebtoken");
const { JWT_Secret } = require("./knexfile");

exports.sendToken = (req, res, next) => {
  const { username, password } = req.body;
  connection("users")
    .where({ username })
    .then(([user]) => {
      if (!user || password !== user.password)
        next({ status: 401, msg: "invalid username or password" });
      else {
        const token = jwt.sign({
          user: user.username,
          iat: Date.now(),
          JWT_Secret
        });
        res.send({ token });
      }
    });
};

exports.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) next({ status: 401, msg: "unauthorized" });
  else {
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_Secret, (err, result) => {
      if (err) next({ status: 401, msg: "unauthorized" });
      else next();
    });
  }
};
