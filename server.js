import connectDB from "./config/connection.js";
const conTable = import('console.table');
import inquirer from 'inquirer';


//db connection for query

connectDB.connect((err) => {
    if (err) throw err;
});


const setupQuest = async () => {
    await inquirer.prompt([
        {
            name: 'connectionQuest',
            type: 'list',
            message: "You're connected to the employee datbase. What would you like to do?",
            choices: ['View all employees', 'View all departments', 'View all roles', 'Add a Department', 'Add a role', 'Add an employee', 'Update an employee']

        },
    ])
        .then((userData) => {
            if (userData.connectionQuest === "View all employees") {
                viewEmployees().then(setupQuest)
            }

            if (userData.connectionQuest === "View all departments") {
                viewDepartments().then(setupQuest)
            }

            if (userData.connectionQuest === "View all roles") {
                viewRoles().then(setupQuest)
            }

            if (userData.connectionQuest === "Add a Department") {
                addDept()
            }

            if (userData.connectionQuest === "Add a role") {
                addRoles()
            }

            if (userData.connectionQuest === "Add an employee") {
                addEmployee()
            }

            if (userData.connectionQuest === "Update an employee") {
                updateEmployee()
            }

        })
}

const viewEmployees = async () => {
    let data = await connectDB.promise().query("SELECT a.id AS 'ID', a.first_name AS 'First Name', a.last_name AS 'Last Name', roles.title AS 'Job Title', department.name AS 'Department', roles.salary AS 'Salary', CONCAT(b.first_name, '  ', b.last_name) AS 'Manager' FROM employee a JOIN roles ON a.id = roles.id JOIN department ON roles.department_id = department.id LEFT OUTER JOIN employee b ON a.manager_id = b.id;")
    console.table(data[0]);
};

const viewDepartments = async () => {
    let data = await connectDB.promise().query("SELECT * FROM department");
    console.table(data[0]);
};

const viewRoles = async () => {
    let data = await connectDB.promise().query("SELECT roles.ID AS 'ID', roles.title AS 'Title', department.name AS 'Department', roles.salary AS 'Salary' FROM roles JOIN department ON roles.department_id = department.id;");
    console.table(data[0]);
};

const addDept = () => {
    inquirer.prompt([{
        name: 'deptAdd',
        type: 'input',
        message: 'Enter name for new department'
    },
    ]).then((deptName) => {
        connectDB.query(`INSERT INTO department SET ?`, { name: deptName.deptAdd });
        setupQuest()
    })
};
const addRoles = async () => {
    let departments = await connectDB.promise().query(
        `SELECT name,id AS value FROM department`
    );
    console.log('departments: ', departments[0])
    inquirer.prompt([{
        name: 'title',
        type: 'input',
        message: 'Enter the title for the new role'
    },
    {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the new role',
    },
    {
        name: 'department_id',
        type: 'rawlist',
        message: 'Enter a department id for the new role',
        choices: departments[0]
    },
    ]).then((roleInput) => {
        connectDB.query(
            `INSERT INTO roles SET ?`, roleInput,
            (err, res) => {
                if (err) throw err;
                setupQuest()
            }
        )
    })
};
// const addRoles = () => {

//     connectDB.query(`SELECT * FROM department;`, (err, res) => {
//         if (err) throw err;
//         let department = res.map(departments => ({ name: department.name, value: department.id }));

//         // return connectDB.promise().query(
//         //     `SELECT department.id, department.name FROM department;`
//         // ).then(([rows])=> {
//         //     let departments = rows;
//         //         const departChoices = departments.map(({ id, name})=> ({
//         //     name: name, 
//         //     value: id 
//         // }) );



//         //console.log('departments: ', departments[0]);
//         inquirer.prompt([
//             {
//                 name: 'title',
//                 type: 'input',
//                 message: 'Enter the title for the new role'
//             },
//             {
//                 name: 'salary',
//                 type: 'input',
//                 message: 'Enter the salary for the new role'
//             },
//             {
//                 name: 'department_id',
//                 type: 'list',
//                 message: 'Enter a department id for the new role',
//                 choices: departChoices
//             }

//         ]).then((roleInput) => {
//             return connectDB.query(
//                 `INSERT INTO roles SET ?`, roleInput
//                 (err, res) => {
//                 if (err) throw err;
//                 setupQuest()
//             }
//             )
      
//     })
// })

// };

const addEmployee = () => {
    connectDB.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        let role = res.map(roles => ({ name: roles.title, value: roles.id }));
        connectDB.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter the first name of the new employee'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter the new employees last name'
                },
                {
                    name: 'roles',
                    type: 'rawlist',
                    message: 'please enter the role for the new employee',
                    choices: role
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    message: 'enter the manager of the new employee',
                    choices: employees
                }
            ]).then((employeeInput) => {
                connectDB.query(
                    `INSERT INTO employee SET ?`, { first_name: employeeInput.firstName, last_name: employeeInput.lastName, roles_id: employeeInput.roles, manager_id: employeeInput.manager },
                    (err, res) => {
                        if (err) throw err;
                        setupQuest()
                    }
                )
            })
        })
    })
};

const updateEmployee = () => {
    connectDB.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        let role = res.map(roles => ({
            name: roles.title, value: roles.id
        }));
        connectDB.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({
                name: employee.first_name + ' ' + employee.last_name, value: employee.id
            }));
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'rawlist',
                    message: 'choose the employee you would like to update',
                    choices: employees
                },
                {
                    name: 'empRole',
                    type: 'rawlist',
                    message: 'choose the new role for the employee',
                    choices: role
                },

            ]).then((updateInput) => {
                connectDB.query(`UPDATE employee SET ? WHERE ?`, [{ roles_id: updateInput.empRole }, { id: updateInput.employee }],
                    (err, res) => {
                        if (err) throw err;
                        setupQuest()
                    })
            })
        })
    })
};
setupQuest();