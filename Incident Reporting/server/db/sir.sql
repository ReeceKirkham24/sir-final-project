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
