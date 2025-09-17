const db = require('../db/connect')

class Organisation{
    constructor({ Org_Id, Name, Password_Hash, Is_Account_Active }){
        this.Org_Id = Org_Id
        this.Name = Name 
        this.Password_Hash = Password_Hash
        this.Is_Account_Active = Is_Account_Active
    }


    static async getOrgById(Org_Id){
        const id = Org_Id
        const response = await db.query('SELECT * FROM Organisation WHERE Org_Id = $1', [Org_Id])
        if(response.rows.length != 1){
            throw Error("Cannot find a org with that id")
        }return new Organisation(response.rows[0])

    }



    static async createOrg(orgData){
        const { Name, Password_Hash, Is_Account_Active } = orgData
        const response = await db.query('INSERT INTO Organisation(Name, Password_Hash, Is_Account_Active) VALUES($1, $2, $3) RETURNING *', [Name, Password_Hash, Is_Account_Active ])
        if(response.rows.length == 0){
            throw Error("Failed to create organisation")
        }
        return new Organisation(response.rows[0])
    }


    async changeOrgName(data){
        const response = await db.query("UPDATE organisation SET Name = $1 WHERE id = $2 RETURNING *", [data.Name, this.Org_Id])
        if(response.rows.length == 0){
            throw new Error("Could not find an organisation with that Id")
        } return new Organisation(response.rows[0])
    }

    async deleteOrganisation(){
        const response = await db.query('DELETE * FROM organisation WHERE id = $1', [this.Org_Id])
        return new Organisation(response.rows[0])
    }

    



}

module.exports = Organisation