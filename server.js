const conTable = import('console.table');
import connectDB from "./config/connection";
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
            choices: ['View all employees', 'View all departments', 'View all roles', 'Add a Department', 'Add a role', 'Add an employee role', 'Update an employee']

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

            if (userData.connectionQuest === "Add a roles") {
                addRoles()
            }

            if (userData.connectionQuest === "Add an employee role") {
                addEmployee()
            }

            if (userData.connectionQuest === "Update an employee") {
                updateEmployee()
            }

        })
}

const viewEmployees = async () => {
    let data = await connectDB.promise().query(
        `SELECT a.first_name as "First Name", a.last_name as "Last Name", roles.title as Title, roles.salary as Salary, 
        department.dept_name as Department, 
        CONCAT(b.first_name, ' ', b.last_name) as Manager from employee a left join employee b on a.manager_id = b.id left join roles on a.roles_id = roles.roles.id left join department ON role.dept_id = department.dept_id`
    ); console.table(data[0]);

};

const viewDepartments = async () => {
    let data = await connectDB.promise().query("SELECT * FROM department");
    console.table(data[0]);
};

const viewRoles = async () => {
    let data = await connectDB.promise().query('SELECT roles_id as ID, ')
}

const addDept = () => {
    inquirer.prompt([{
        name: 'deptAdd',
        type: 'input',
        message: 'Enter name for new department'
    },
    ]).then ((deptName)=>{
    connectDB.query(`INSERT INTO department SET ?`, {name: deptName.deptAdd});
    setupQuest()
    })
};

const addRoles = async () => {
    let departments = await connectDB.promise().query(
        `SELECT name, dept_id AS value FROM department`
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
        name: 'dept_id',
        type: 'rawlist',
        message: 'Enter a department id for the new role',
        choices: departments[0]
    },
]).then((roleInput)=>{
    connectDB.query(
        `INSERT INTO roles SET ?`, roleInput,
        (err, res) => {
            if (err) throw err;
            setupQuest()
        }
    )
})
};

const addEmployee = () => {
    connectDB.query(`SELECT * FROM roles;`, (err, res)=> {
        if (err)throw err; 
        let eroles = res.map(roles => ({name: roles.title, value: roles.roles_id}));
        connectDB.query(`SELECT * FROM employee`, (err, res)=> {
            if (err)throw err;
            let employees = res.map(employee => ({name: employee.first_name + '' + employee.last_name, value: employee.employee_id}))
            inquirer.prompt ([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter the first name of the new employee'
                }
            ])
        })
    })
}