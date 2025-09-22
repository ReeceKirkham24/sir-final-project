await db.query(QueryName, QueryValues);
//Users

//Insert New User
const insertUserQuery = `
INSERT INTO "User" (Name, Email, Org_Id, Department_Id, Password_Hash)
VALUES ($1, $2, $3, $4, $5)
RETURNING User_Id;
`;

// Update
const insertUserValues = [userName, userEmail, userOrgId, userDeptId, userPasswordHash];


const updateUserQuery = `
  UPDATE "User"
  SET Name = $1, Email = $2, Department_Id = $3
  WHERE User_Id = $4;
`;

const updateUserValues = [updatedName, updatedEmail, updatedDeptId, useridToUpdate];


// Delete
const deleteUserQuery = `DELETE FROM "User" WHERE User_Id = $1;`;
const deleteUserValues = [useridToDelete];




//Tickets

const insertTicketQuery = `
  INSERT INTO Tickets (Status, Text, Severity, Category, User_Id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING Ticket_Id;
`;
const insertTicketValues = [ticketStatus, ticketText, ticketSeverity, ticketCategory, ticketUserId];


//Update
const updateTicketQuery = `
  UPDATE Tickets
  SET Status = $1, Date_Completed = $2
  WHERE Ticket_Id = $3;
`;
const updateTicketValues = [newTicketStatus, ticketDateCompleted, ticketidToUpdate];

// Delete
const deleteTicketQuery = `DELETE FROM Tickets WHERE Ticket_Id = $1;`;
const deleteTicketValues = [ticketidToDelete];


//Comments

// Insert
const insertCommentQuery = `
  INSERT INTO Comments (Ticket_Id, User_Id, Body)
  VALUES ($1, $2, $3)
  RETURNING Comment_Id;
`;
const insertCommentValues = [commentTicketId, commentUserId, commentBody];

// Update
const updateCommentQuery = `
  UPDATE Comments
  SET Body = $1
  WHERE Comment_Id = $2;
`;
const updateCommentValues = [updatedCommentBody, commentidToUpdate];

// Delete
const deleteCommentQuery = `DELETE FROM Comments WHERE Comment_Id = $1;`;
const deleteCommentValues = [commentidToDelete];





//Department

// Insert
const insertDepartmentQuery = `
  INSERT INTO Department (Name, Description)
  VALUES ($1, $2)
  RETURNING Department_Id;
`;
const insertDepartmentValues = [departmentName, departmentDescription];

// Update
const updateDepartmentQuery = `
  UPDATE Department
  SET Name = $1, Description = $2
  WHERE Department_Id = $3;
`;
const updateDepartmentValues = [updatedDeptName, updatedDeptDescription, departmentIdToUpdate];

// Delete
const deleteDepartmentQuery = `DELETE FROM Department WHERE Department_Id = $1;`;
const deleteDepartmentValues = [departmentIdToDelete];



//Orgnaisation

// Insert
const insertOrganisationQuery = `
  INSERT INTO Organisation (Name, Password_Hash, Is_Account_Active)
  VALUES ($1, $2, $3)
  RETURNING Org_Id;
`;
const insertOrganisationValues = [orgName, orgPasswordHash, orgIsActive];

// Update (activate/deactivate)
const updateOrganisationQuery = `
  UPDATE Organisation
  SET Is_Account_Active = $1
  WHERE Org_Id = $2;
`;
const updateOrganisationValues = [orgIsActiveUpdated, orgIdToUpdate];

// Delete
const deleteOrganisationQuery = `DELETE FROM Organisation WHERE Org_Id = $1;`;
const deleteOrganisationValues = [orgIdToDelete];
