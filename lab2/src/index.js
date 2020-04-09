const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.text());

var strings = [];

app.get("/", (req, res) =>
  res.send(
    "Send POST request to /create in order to save new string, GET request to /list to see the strings"
  )
);

app.get("/list", function(req, res) {
  res.send(strings.toString());
});

app.post("/create", function(req, res) {
  strings.push(req.body);
  console.log("Request Body: " + req.body);
  res.send("String is saved");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
