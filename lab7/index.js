const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Sequelize = require('sequelize');

// init sequelize
const sequelize = new Sequelize('students', 'me', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

// check if connection has been established
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// MODEL DEFINITIONS

const Model = Sequelize.Model;
//const DataTypes = Sequelize.DataTypes;
const uuid = require('uuid');

// define Student model
class Student extends Model {}
Student.init({
  // attributes
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: () => uuid.v1()
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
    // allowNull defaults to true
  },
  groupId: {
    type: Sequelize.UUID,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'student',
  // options
  timestamps : true
});

// define Group model
class Group extends Model {}
Group.init({
  // attributes
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: () => uuid.v1()
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'group',
  // options
  timestamps : false
});

// define relation
Group.hasMany(Student, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Student.belongsTo(Group);

// automatically create the table (or modify it as needed) according to the models definition
sequelize.sync();

// ROUTES HANDLING

// GROUPS ROUTES

app.get("/", (req, res) => res.send("Simple REST API enabled with Sequelize"));

app.get('/groups', async function (req, res) {
  const groups = await Group.findAll({
    include: [
        { model: Student, as: 'students' }
    ]
  });
  
  if (!groups) {
    res.statusCode = 404;
    return res.end("Failed to retrieve groups");
  }
  else {
    res.statusCode = 200;
    return res.json(groups);
  }
});

app.post('/groups', async function (req, res) {
  if (!req.body) {
    res.statusCode = 400;
    return res.end("Body is required");
  }

  const { name } = req.body;

  if (!name) {
    res.statusCode = 400;
    return res.end('Args are invalid');
  }

  const createdGroup = await Group.create({ name });

  if (!createdGroup) {
    res.statusCode = 400;
    return res.end('Failed to create group');
  }
  else {
    res.statusCode = 200;
    return res.end('Group successfully created');
  }
});

app.delete('/groups/:id', async function (req, res) {
  const { id } = req.params;
  
  const deletedGroup = await Group.destroy({
    where: {
      id: id
    }
  });

  if (!deletedGroup) {
    res.statusCode = 200;
    return res.end("Group with this id was not found");
  }
  else {
    res.statusCode = 200;
    return res.json("Group successfully deleted");
  }
});

// STUDENTS ROUTES

app.get('/students', async function (req, res) {
  const students = await Student.findAll();
  
  if (!students) {
    res.statusCode = 404;
    return res.end("Failed to retrieve students");
  }
  else {
    res.statusCode = 200;
    return res.json(students);
  }
});

app.get('/students/:id', async function (req, res) {
  const { id } = req.params;
  
  const student = await Student.findOne({ where: { id }, include: Group });
  
  if (!student) {
    res.statusCode = 404;
    return res.end("Student with this id was not found");
  }
  else {
    res.statusCode = 200;
    return res.json(student);
  }
});

app.post('/students', async function (req, res) {
  if (!req.body) {
    res.statusCode = 400;
    return res.end("Body is required");
  }

  const { firstName, lastName, groupId } = req.body;

  if (!firstName || !lastName || !groupId) {
    res.statusCode = 400;
    return res.end('Args are invalid');
  }

  const createdStudent = await Student.create({ firstName, lastName, groupId });

  if (!createdStudent) {
    res.statusCode = 400;
    return res.end('Cannot create a student');
  }
  else {
    res.statusCode = 200;
    return res.end('Student successfully created');
  }
});

app.put('/students/:id', async function (req, res) {
  if (!req.body) {
    res.statusCode = 400;
    return res.end("Body is required");
  }
  
  const { id } = req.params;
  const { firstName, lastName, groupId } = req.body;

  if (!firstName || !lastName || !groupId) {
    res.statusCode = 400;
    return res.end('Args are invalid');
  }
  
  const student = await Student.update({ firstName, lastName, groupId }, {
    where: {
      id: id
    }
  });
  
  if (!student) {
    res.statusCode = 404;
    return res.end("Failed to update the student");
  }
  else {
    res.statusCode = 200;
    return res.end('Student successfully updated');
  }
});

app.delete('/students/:id', async function (req, res) {
  const { id } = req.params;
  
  const deletedStudent = await Student.destroy({
    where: {
      id: id
    }
  });

  if (!deletedStudent) {
    res.statusCode = 200;
    return res.end("Student with this id was not found");
  }
  else {
    res.statusCode = 200;
    return res.end("Student successfully deleted");
  }
});

app.listen(port, () => console.log(`Express app listening at http://localhost:${port}`));