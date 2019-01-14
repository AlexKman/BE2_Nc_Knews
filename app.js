const express = require("express");
const app = express();
const body_parser = require("body-parser");
const apiRouter = require("./routes/apiRouter");

app.use(body_parser.json());

app.get("/", (req, res) => {
  res.send("This is the API");
});

app.use("/api", apiRouter);

module.exports = app;
