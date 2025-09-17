const db = require('../db/connect')

class Department{
    constructor({Department_Id, Name, Description, Org_Id }){
        this.Department_Id = Department_Id
        this.Name = Name
        this.Description = Description
        this.Org_Id = Org_Id
    }



    static async getAll(Org_Id){
        const response = await db.query('SELECT * FROM departments WHERE Org_Id = $1', [Org_Id])
        if(response.rows.length == 0){
            throw Error("No departments currently exist")
        }return response.rows.map((department) => new Department(department))
    }

    static async getDepById(Department_Id){
        const response = await db.query('SELECT * FROM department WHERE Department_Id = $1', [Department_Id])
        if(response.rows.length != 1){
            throw Error("Could not find department with this ID, or there a duplicates")
        } return new Department(response)
    }


    static async createDep(Org_Id){
        const response = await db.query('INSERT INTO department (Name, Description, Org_Id) VALUES ($1, $2, $3) RETURNING *', [Name, Description, Org_Id])
        if(response.rows.length == 0){
            throw Error("Failed to create this department")
        } return new Department(response.rows[0])
    }

    async update(data){
        const response = await db.query('UPDATE department SET Name = $1 WHERE Name = $2', [this.Name, data.Name])
        if(response.rows.length == 0){
            throw new Error('Cannot find a department with this name')
        }return new Department(response.rows[0])
    }


    async delete(){
        const response = await db.query('DELETE * FROM department WHERE Department_Id = $1', [this.Department_Id])
        return new Department(response.rows[0])
    }
}

module.exports = Department