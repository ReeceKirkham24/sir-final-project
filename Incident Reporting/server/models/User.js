const { response } = require('express');



class User {
    constructor({ User_Id, Name, Email, Org_Id, Department_Id, Password_Hash}){
        this.User_Id = User_Id
        this.Name = Name
        this.Email = Email
        this.Org_Id = Org_Id
        this.Department_Id = Department_Id
        this.Password_Hash = Password_Hash
    }

    // TODO: add control flow that prevents creation of user w/ same email
    static async createUser(userData){
        const { Name, Email, Org_Id, Department_Id, Password_Hash } = userData
        // pull out the keys that exist in the userData object that we parse into this models params ( it will be the user inputted data)
        const response = await db.query('INSERT INTO user(Name, Email, Org_Id, Department_Id, Password_Hash) VALUES($1, $2, $3, $4, $5) RETURNING *', [Name, Email, Org_Id, Department_Id, Password_Hash])
        if(response.rows == 0){
            throw new Error("Failed to create user")
        }
        return new User(response.rows[0])

        
    }




}

module.exports = User






