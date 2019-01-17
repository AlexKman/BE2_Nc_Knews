const express = require('express');
const body_parser = require('body-parser');
const { handle404, handle400 } = require('./errors');
const { sendToken, verifyToken } = require('./auth');

const app = express();

const apiRouter = require('./routes/apiRouter');

app.use(body_parser.json());

// app.post("/login", sendToken);

// app.use(verifyToken);

app.get('/', (req, res) => {
  res.send('api');
});

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);

module.exports = app;
