const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.json());

var students = [];

app.get("/", (req, res) => res.send("Simple REST API"));

app.get("/students", function(req, res) {
  res.send(students);
});

app.get("/students/:id", function(req, res) {
  var result = {};
  for (const s_obj of students) {
    if (s_obj["id"] === req.params.id) {
      result = s_obj;
      break;
    }
  }
  if (!result.hasOwnProperty("id")) res.send("No student with such id");
  else res.send(result);
});

app.post("/students", function(req, res) {
  const student_obj = req.body;

  if (students.length) {
    student_obj["id"] = (
      parseInt(students[students.length - 1]["id"], 10) + 1
    ).toString();
  } else student_obj["id"] = "1";

  const current_date = new Date();
  student_obj["created"] = current_date.toString();
  student_obj["updated"] = student_obj["created"];

  students.push(student_obj);
  res.send("Student info is saved");
});

app.put("/students/:id", function(req, res) {
  const new_info = req.body;
  console.log(new_info);
  for (var i = 0; i < students.length; i++) {
    if (students[i]["id"] === req.params.id) {
      if (new_info.hasOwnProperty("firstName"))
        students[i]["firstName"] = new_info["firstName"];
      if (new_info.hasOwnProperty("lastName"))
        students[i]["lastName"] = new_info["lastName"];
      if (new_info.hasOwnProperty("group"))
        students[i]["group"] = new_info["group"];

      const current_date = new Date();
      students[i]["updated"] = current_date.toString();

      res.send("Successfully updated");
    }
  }
  res.send("No student with such id");
});

app.delete("/students/:id", function(req, res) {
  for (var i = 0; i < students.length; i++) {
    if (students[i]["id"] === req.params.id) {
      students.splice(i, 1);
    }
  }
  res.send("Successfully deleted");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
