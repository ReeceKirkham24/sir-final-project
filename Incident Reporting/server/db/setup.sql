DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS organisation;

CREATE TABLE organisation (
    org_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_account_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (org_id)
);

CREATE TABLE department (
    department_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (department_id)
);

CREATE TABLE "user" (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL, --maybe first name and last name
    email VARCHAR(255) UNIQUE NOT NULL,
    org_id INT NOT NULL,
    department_id INT, --maybe user might not have a department
    password_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (org_id) REFERENCES organisation(org_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE tickets (
    ticket_id INT GENERATED ALWAYS AS IDENTITY,
    status VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    severity VARCHAR(50),
    category VARCHAR(50),
    user_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_completed TIMESTAMP,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE comments (
    comment_id INT GENERATED ALWAYS AS IDENTITY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);


--Seed Data

-- organisations
INSERT INTO organisation (name, password_hash, is_account_active)
VALUES 
('Tech Corp', 'hash_org1', TRUE),
('Health Systems', 'hash_org2', TRUE),
('EduWorld', 'hash_org3', FALSE);

-- Departments
INSERT INTO department (name, description, org_id)
VALUES
('IT Support', 'Handles technical issues', 1),
('HR', 'Manages employee relations', 1),
('Finance', 'Manages budgets and payroll', 3),
('Academic Services', 'Supports students and faculty', 2);

-- users
INSERT INTO "user" (name, email, org_id, department_id, password_hash)
VALUES
('Alice Johnson', 'alice@techcorp.com', 1, 1, 'pw_hash1'),
('Bob Smith', 'bob@techcorp.com', 1, 2, 'pw_hash2'),
('Charlie Evans', 'charlie@techcorp.com', 1, NULL, 'pw_hash3'), -- no department
('Diana Patel', 'diana@healthsys.com', 2, 1, 'pw_hash4'),
('Ethan Liu', 'ethan@healthsys.com', 2, 3, 'pw_hash5'),
('Fiona Garcia', 'fiona@eduworld.com', 3, 4, 'pw_hash6');

-- tickets
INSERT INTO tickets (status, text, severity, category, user_id, date_completed)
VALUES
('Open', 'Laptop not starting', 'High', 'Hardware', 1, NULL),
('In Progress', 'VPN connection failing intermittently', 'Medium', 'Networking', 1, NULL),
('Closed', 'Payroll discrepancy for August', 'High', 'Finance', 2, CURRENT_TIMESTAMP),
('Open', 'email not syncing on mobile device', 'Low', 'Software', 3, NULL),
('In Progress', 'System outage in radiology dept.', 'Critical', 'Infrastructure', 4, NULL),
('Closed', 'Budget report formatting issue', 'Low', 'Finance', 5, CURRENT_TIMESTAMP),
('Open', 'Unable to access course portal', 'Medium', 'Academic Services', 6, NULL);

-- Comments
INSERT INTO comments (ticket_id, user_id, body)
VALUES
(1, 1, 'Tried restarting but still not working.'),
(1, 2, 'Please bring the laptop to IT support desk.'),
(2, 1, 'Happens mostly in the evenings.'),
(3, 2, 'Issue resolved, payroll corrected.'),
(5, 4, 'Urgent - doctors cannot access patient records.'),
(5, 1, 'Investigating network logs now.'),
(5, 2, 'Switch failure identified, replacement scheduled.'),
(7, 6, 'Error appears right after login attempt.');