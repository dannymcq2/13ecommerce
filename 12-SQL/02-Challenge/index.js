const inquirer = require('inquirer');
const db = require('./db/queries');

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then(async (answers) => {
        switch (answers.action) {
            case 'View all departments':
                const departments = await db.viewAllDepartments();
                console.table(departments);
                break;
            case 'View all roles':
                const roles = await db.viewAllRoles();
                console.table(roles);
                break;
            case 'View all employees':
                const employees = await db.viewAllEmployees();
                console.table(employees);
                break;
            case 'Add a department':
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Enter the name of the department:'
                    }
                ]).then(async (answer) => {
                    await db.addDepartment(answer.name);
                    console.log(`Department '${answer.name}' added successfully.`);
                });
                break;
            case 'Add a role':
                const departmentsForRole = await db.viewAllDepartments();
                const departmentChoices = departmentsForRole.map(dept => ({ name: dept.name, value: dept.id }));
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter the role title:'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the role salary:'
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'Select the department for the role:',
                        choices: departmentChoices
                    }
                ]).then(async (answers) => {
                    await db.addRole(answers.title, answers.salary, answers.department_id);
                    console.log(`Role '${answers.title}' added successfully.`);
                });
                break;
            case 'Add an employee':
                const rolesForEmployee = await db.viewAllRoles();
                const roleChoices = rolesForEmployee.map(role => ({ name: role.title, value: role.id }));
                const employeesForManager = await db.viewAllEmployees();
                const managerChoices = employeesForManager.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
                managerChoices.push({ name: 'None', value: null });
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Enter the employee first name:'
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Enter the employee last name:'
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select the employee role:',
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Select the employee manager:',
                        choices: managerChoices
                    }
                ]).then(async (answers) => {
                    await db.addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
                    console.log(`Employee '${answers.first_name} ${answers.last_name}' added successfully.`);
                });
                break;
            case 'Update an employee role':
                const employeesForUpdate = await db.viewAllEmployees();
                const employeeChoices = employeesForUpdate.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
                const rolesForUpdate = await db.viewAllRoles();
                const roleChoicesForUpdate = rolesForUpdate.map(role => ({ name: role.title, value: role.id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee_id',
                        message: 'Select the employee to update:',
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select the new role:',
                        choices: roleChoicesForUpdate
                    }
                ]).then(async (answers) => {
                    await db.updateEmployeeRole(answers.employee_id, answers.role_id);
                    console.log('Employee role updated successfully.');
                });
                break;
            case 'Exit':
                process.exit();
                break;
            default:
                console.log('Invalid action.');
        }
        mainMenu();
    });
};

mainMenu();