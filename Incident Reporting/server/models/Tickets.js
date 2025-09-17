const db = require('../db/connect')

class Ticket{
    constructor({ticketId, textContent, severityLevel, userId}){
        this.ticketId = ticketId
        this.textContent = textContent
        this.severityLevel = severityLevel
        this.userId = userId
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM tickets;")
        if (response.rows.length === 0) {
            throw Error("No tickets available")
        }
        return response.rows.map(ticket => new Ticket(ticket))
    }

    static async getOneByID(ticket) {
        const response = await db.query("SELECT * FROM tickets WHERE ticketId = $1;", [ticket])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate ticket")
        }
        return new Ticket(response.rows[0])
    }

    static async create(data){
        const {textContent, severityLevel, userId} = data
        const existingUser = await db.query("SELECT userId FROM users WHERE userId = $1;", [userId])
        
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }
        const response = await db.query("INSERT INTO tickets (textContent, severityLevel, userId) VALUES ($1, $2, $3) RETURNING *;", [textContent, severityLevel, userId])
            return new Ticket(response.rows[0])
    }

    async update(data){
        const { textContent, severityLevel, userId } = data
        const response = await db.query("UPDATE tickets SET textContent = $1, severityLevel = $2, userId = $3 WHERE RETURNING *;",[textContent, severityLevel, userId]
        )
        if (response.rows.length !== 1) {
            throw Error("Unable to update ticket")
        }
        return new Ticket(response.rows[0])
    }
    
    async destroy(){
        try {
            const response = await db.query("DELETE FROM tickets WHERE ticketId = $1;", [this.ticketId])
        } catch (error) {
            throw Error("Cannot delete ticket")
        }
    }
}
module.exports = Ticket