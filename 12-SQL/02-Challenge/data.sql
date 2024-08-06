-- Insert data into department
INSERT INTO department (name) VALUES 
  ('HR'), 
  ('Engineering'), 
  ('Sales');

-- Insert data into role
INSERT INTO role (title, salary, department_id) VALUES 
  ('HR Manager', 70000, 1), 
  ('Software Engineer', 80000, 2), 
  ('Sales Representative', 60000, 3);

-- Insert data into employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
  ('John', 'Doe', 1, NULL), 
  ('Jane', 'Smith', 2, 1), 
  ('Jim', 'Brown', 3, NULL);
