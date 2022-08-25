-- CREATING EMPLOYEE DATABASE AND REQUIRED TABLES

DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

-- WITHIN THE DATABASE CREATE THE TABLES NEEDED

USE employee_db;

CREATE TABLE department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY, 
    dept_name VARCHAR (255) NOT NULL
);

CREATE TABLE roles (
    roles_id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR (255),
    salary DECIMAL, 
    dept_id INT, 
    CONSTRAINT fk_department FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE CASCADE  
);

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    roles_id INT, 
    manager_id INT NULL,
    CONSTRAINT fk_roles FOREIGN KEY (roles_id) REFERENCES roles(roles_id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(employee_id) ON DELETE SET NULL
    );