const mysql = require('mysql2');
const inquirer = require('inquirer');

// connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password -> TODO: store in an env file for protection.
      password: 'root',
      database: 'employees_db'
    },
);

db.connect((err) => {
  if(err) {
    console.log('Error connecting to database:', err);
  } else {
    console.log('Connected to employees_db');
  }
});

const promptInit =  {
  showDept: () => {
    db.query(`SELECT * FROM department;`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
    });
  },

  showRoles: () => {
    db.query(`SELECT role.id, role.title, department.name, role.salary
    FROM role
    JOIN department ON role.department_id = department.id`, (err, result) => {
      
      if (err) {
        console.log(err);
      }
      console.table(result);
    });
  },

  showEmp: () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
    , (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result,);
    });
  },

  addDept: () => {
    // Prompts to add a new dept to database
    inquirer.prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the name of the department?"
      }
    ]).then((answers) => {
      console.log(answers);
      const deptName = answers.deptName;
      db.query(`INSERT INTO department (name)
      VALUES ('${deptName}')`);
      console.log(`Added ${deptName} to the database.)`)
    }).catch((err) => {
        console.log('Error found:', err)
    });
  }
};

module.exports = {promptInit};
