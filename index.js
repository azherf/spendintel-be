const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.render("Hello world!");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
})