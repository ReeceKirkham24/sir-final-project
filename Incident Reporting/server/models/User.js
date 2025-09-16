// const db = require("../db/") -------------------------------

class User {
    constructor({
        User_Id,
        Name,
        Email,
        Org_Id,
        Department_Id,
        Password_Hash
    })
    {
        this.User_Id = User_Id,
        this.Name = Name,
        this.Email = Email,
        this.Org_Id = Org_Id,
        this.Department_Id = Department_Id,
        this.Password_Hash = Password_Hash;
    }
    
    static async getAll() {
        const response = await db.query("SELECT name FROM users");
        if (response.rows.length === 0) {
            throw Error("No users available");
        } 
        return response.rows.map((user) => new User(user));
    }

    

}
