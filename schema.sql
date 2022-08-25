-- CREATING EMPLOYEE DATABASE AND REQUIRED TABLES

DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

-- WITHIN THE DATABASE CREATE THE TABLES NEEDED

USE employee_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR (255) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR (255),
    salary DECIMAL, 
    department_id INT, 
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE  
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    roles_id INT, 
    manager_id INT NULL,
    FOREIGN KEY (roles_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
    );