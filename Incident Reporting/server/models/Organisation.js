const db = require('../db/connect')


class Organisation{
    constructor({ org_id, name, password_hash, is_account_active }){
        this.org_id = org_id
        this.name = name 
        this.password_hash = password_hash
        this.is_account_active = is_account_active
    }


    static async getOrgById(org_id){
        const response = await db.query('SELECT * FROM organisation WHERE org_id = $1', [org_id])
        console.log(response.rows)
        if(response.rows.length != 1){
            throw Error("Cannot find a org with that id")
        }return new Organisation(response.rows[0])

    }



    static async createOrg(orgData){
        const { name, password_hash, is_account_active } = orgData
        const response = await db.query('INSERT INTO organisation(name, password_hash, is_account_active) VALUES($1, $2, $3) RETURNING *', [name, password_hash, is_account_active ])
        if(response.rows.length == 0){
            throw Error("Failed to create organisation")
        }
        return new Organisation(response.rows[0])
    }


    async changeOrgName(data){
        const response = await db.query("UPDATE organisation SET name = $1 WHERE org_id = $2 RETURNING *", [data.name, data.org_id])
        if(response.rows.length == 0){
            throw new Error("Could not find an organisation with that Id")
        } return new Organisation(response.rows[0])
    }

    async deleteOrganisation(){
        const response = await db.query('DELETE FROM organisation WHERE org_id = $1', [this.org_id])
    }

    



}

module.exports = Organisation