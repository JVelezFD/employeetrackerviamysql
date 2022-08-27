INSERT INTO department (name)
VALUES ('Engineering'), ('Sales'), ('Finance'), ('Legal'), ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES ('Junior Software Engineer', 1000000, 1),
('Senior Software Engineer', 250000, 1),
('Account Executive', 125000, 2),
('Controller', 100000, 3),
('General Counsel', 100000, 4),
('HR Coordinator', 80000, 5);



INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ('Jesus', 'Velez', 1, NULL),
('Jenny', 'Fromdablock', 2, 1 ),
('Benny', 'Fleck', 3, NULL),
('Kevin', 'James', 4, 3),
('Timmy', 'Boyi', 5, NULL);

