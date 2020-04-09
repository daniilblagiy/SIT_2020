const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.json());

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "students",
  password: "password",
  port: 5432
});

app.get("/", (req, res) => res.send("Simple REST API enabled with PostgreSQL"));

app.get("/students", function(req, res) {
	pool.query("select * from students", (err, qres) => {
		if (err) {
		  console.log(err.stack);
		  res.send("Failed to get the data");
		} else {
			console.log(qres.rows);
			res.json(qres.rows);
		}
	  })
});

app.get("/students/:id", function(req, res) {
	const query = "select * from students where id=$1";
    const values = [req.params.id];
	
	pool.query(query, values, (err, qres) => {
	if (err) {
	  console.log(err.stack);
	  res.send("Failed to get the data");
	} else {
		console.log(qres.rows);
		res.json(qres.rows);
	}
  })
});

app.post("/students", function(req, res) {
  const student = req.body;

  const current_date = new Date();
  student["created"] = current_date.toString();
  student["updated"] = student["created"];

  const query =
      "insert into students (first_name, last_name, group_name, created_at, updated_at) values ($1, $2, $3, $4, $5)";
    const values = [
      student["firstName"],
      student["lastName"],
      student["group"],
      student["created"],
      student["updated"]
    ];
	
	pool.query(query, values, (err, qres) => {
	if (err) {
	  console.log(err.stack);
	  res.send("Failed to set the data");
	} else {
		res.send("Student info is saved");
	}
  })
});

app.put("/students/:id", function(req, res) {
  const new_info = req.body;
  console.log(new_info);
  
  const query =
      "update students set first_name = $1, last_name = $2, group_name = $3, updated_at = $4 where id = $5";
    const current_date = new Date();
    const values = [
		new_info["firstName"],
		new_info["lastName"],
		new_info["group"],
		  current_date.toString(),
		  req.params.id
	];
	
	pool.query(query, values, (err, qres) => {
		if (err) {
		  console.log(err.stack);
		  res.send("Failed to set the data");
		} else {
			res.send("Student info is updated");
		}
	  })
});

app.delete("/students/:id", function(req, res) {
	const query = "delete from students where id=$1";
    const values = [req.params.id];

	pool.query(query, values, (err, qres) => {
		if (err) {
		  console.log(err.stack);
		  res.send("Failed to delete the data");
		} else {
			res.send("Student info is deleted");
		}
	  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));