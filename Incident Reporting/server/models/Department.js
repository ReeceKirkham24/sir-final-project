const db = require('../db/connect')

class Department{
    constructor({department_id, name, description, org_id }){
        this.department_id = department_id
        this.name = name
        this.description = description
        this.org_id = org_id
    }



    static async getAll(org_id){
        const response = await db.query('SELECT * FROM department WHERE org_id = $1', [org_id])
        if(response.rows.length == 0){
            throw Error("No departments currently exist")
        }return response.rows.map((department) => new Department(department))
    }

    static async getDepById(department_id){
        const response = await db.query('SELECT * FROM department WHERE department_id = $1', [department_id])
        if(response.rows.length != 1){
            throw Error("Could not find department with this ID, or there a duplicates")
        } return new Department(response)
    }


    static async createDep(data){
        const response = await db.query('INSERT INTO department (name, description, org_id) VALUES ($1, $2, $3) RETURNING *', [data.name, data.description, data.org_id])
        if(response.rows.length == 0){
            throw Error("Failed to create this department")
        } return new Department(response.rows[0])
    }

    async update(data){
        const response = await db.query('UPDATE department SET name = $1 WHERE name = $2', [this.name, data.name])
        if(response.rows.length == 0){
            throw new Error('Cannot find a department with this name')
        }return new Department(response.rows[0])
    }


    async delete(){
        const response = await db.query('DELETE * FROM department WHERE department_id = $1', [this.department_id])
        return new Department(response.rows[0])
    }
}

module.exports = Department