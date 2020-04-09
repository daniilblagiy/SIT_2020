var http = require("http");
const url = require("url");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

//create a server object:
http
  .createServer(function(req, res) {
    const queryObject = url.parse(req.url, true).query;
    var current_date = new Date();
    res.write(
      "Hello, " + queryObject.name + ", today is " + days[current_date.getDay()]
    ); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
