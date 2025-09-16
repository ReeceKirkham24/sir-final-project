DROP TABLE IF EXISTS users, tickets, organisation; 


CREATE TABLE users
(
    userId INT PRIMARY KEY GENERATED AS IDENTITY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    orgId INT NOT NULL,
    FOREIGN KEY orgId REFERENCES organisation(orgId)
);

CREATE TABLE tickets
(
    ticketId INT PRIMARY KEY GENERATED AS IDENTITY,
    textContent VARCHAR(200) NOT NULL, 
    severityLevel VARCHAR(20) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY userId REFERENCES users(userId)
);

CREATE TABLE organisation
(
    orgId INT PRIMARY KEY GENERATED AS IDENTITY,
    name VARCHAR(50) NULL,
);

-- Insert temp data into organisation
INSERT INTO organisation (name) VALUES ('Acme Corp');
INSERT INTO organisation (name) VALUES ('Beta Ltd');
INSERT INTO organisation (name) VALUES ('Gamma Inc');

-- Insert temp data into users
INSERT INTO users (name, email, password, orgId) VALUES ('Alice', 'alice@example.com', 'password123', 1);
INSERT INTO users (name, email, password, orgId) VALUES ('Bob', 'bob@example.com', 'password456', 2);
INSERT INTO users (name, email, password, orgId) VALUES ('Charlie', 'charlie@example.com', 'password789', 3);

-- Insert temp data into tickets
INSERT INTO tickets (textContent, severityLevel, userId) VALUES ('System outage in sector 7', 'High', 1);
INSERT INTO tickets (textContent, severityLevel, userId) VALUES ('Minor UI bug on dashboard', 'Low', 2);
INSERT INTO tickets (textContent, severityLevel, userId) VALUES ('Data sync issue', 'Medium', 3);
