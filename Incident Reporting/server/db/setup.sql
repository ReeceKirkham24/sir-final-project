DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Tickets;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Organisation;

CREATE TABLE Organisation (
    Org_Id INT GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(100) NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    Is_Account_Active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (Org_Id)
);

CREATE TABLE Department (
    Department_Id INT GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Org_Id INT NOT NULL,
    PRIMARY KEY (Department_Id),
    FOREIGN KEY (Org_Id) REFERENCES Organisation(Org_Id)
);

CREATE TABLE "user" (
    User_Id INT GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(255) NOT NULL, --maybe first name and last name
    Email VARCHAR(255) UNIQUE NOT NULL,
    Org_Id INT NOT NULL,
    Department_Id INT, --maybe user might not have a department
    Password_Hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (User_Id),
    FOREIGN KEY (Org_Id) REFERENCES Organisation(Org_Id),
    FOREIGN KEY (Department_Id) REFERENCES Department(Department_Id)
);

CREATE TABLE Tickets (
    Ticket_Id INT GENERATED ALWAYS AS IDENTITY,
    Status VARCHAR(50) NOT NULL,
    Text TEXT NOT NULL,
    Severity VARCHAR(50),
    Category VARCHAR(50),
    User_Id INT NOT NULL,
    Date_Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Date_Completed TIMESTAMP,
    PRIMARY KEY (Ticket_Id),
    FOREIGN KEY (User_Id) REFERENCES "user"(User_Id)
);

CREATE TABLE Comments (
    Comment_Id INT GENERATED ALWAYS AS IDENTITY,
    Ticket_Id INT NOT NULL,
    User_Id INT NOT NULL,
    Body TEXT NOT NULL,
    PRIMARY KEY (Comment_Id),
    FOREIGN KEY (Ticket_Id) REFERENCES Tickets(Ticket_Id),
    FOREIGN KEY (User_Id) REFERENCES "user"(User_Id)
);


--Seed Data

-- Organisations
INSERT INTO Organisation (Name, Password_Hash, Is_Account_Active)
VALUES 
('Tech Corp', 'hash_org1', TRUE),
('Health Systems', 'hash_org2', TRUE),
('EduWorld', 'hash_org3', FALSE);

-- Departments
INSERT INTO Department (Name, Description, Org_Id)
VALUES
('IT Support', 'Handles technical issues', 1),
('HR', 'Manages employee relations', 1),
('Finance', 'Manages budgets and payroll', 3),
('Academic Services', 'Supports students and faculty', 2);

-- Users
INSERT INTO "user" (Name, Email, Org_Id, Department_Id, Password_Hash)
VALUES
('Alice Johnson', 'alice@techcorp.com', 1, 1, 'pw_hash1'),
('Bob Smith', 'bob@techcorp.com', 1, 2, 'pw_hash2'),
('Charlie Evans', 'charlie@techcorp.com', 1, NULL, 'pw_hash3'), -- no department
('Diana Patel', 'diana@healthsys.com', 2, 1, 'pw_hash4'),
('Ethan Liu', 'ethan@healthsys.com', 2, 3, 'pw_hash5'),
('Fiona Garcia', 'fiona@eduworld.com', 3, 4, 'pw_hash6');

-- Tickets
INSERT INTO Tickets (Status, Text, Severity, Category, User_Id, Date_Completed)
VALUES
('Open', 'Laptop not starting', 'High', 'Hardware', 1, NULL),
('In Progress', 'VPN connection failing intermittently', 'Medium', 'Networking', 1, NULL),
('Closed', 'Payroll discrepancy for August', 'High', 'Finance', 2, CURRENT_TIMESTAMP),
('Open', 'Email not syncing on mobile device', 'Low', 'Software', 3, NULL),
('In Progress', 'System outage in radiology dept.', 'Critical', 'Infrastructure', 4, NULL),
('Closed', 'Budget report formatting issue', 'Low', 'Finance', 5, CURRENT_TIMESTAMP),
('Open', 'Unable to access course portal', 'Medium', 'Academic Services', 6, NULL);

-- Comments
INSERT INTO Comments (Ticket_Id, User_Id, Body)
VALUES
(1, 1, 'Tried restarting but still not working.'),
(1, 2, 'Please bring the laptop to IT support desk.'),
(2, 1, 'Happens mostly in the evenings.'),
(3, 2, 'Issue resolved, payroll corrected.'),
(5, 4, 'Urgent - doctors cannot access patient records.'),
(5, 1, 'Investigating network logs now.'),
(5, 2, 'Switch failure identified, replacement scheduled.'),
(7, 6, 'Error appears right after login attempt.');