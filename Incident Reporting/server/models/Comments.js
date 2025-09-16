const db = require('../db/')

class Comment{
    constructor({commentId, ticketId, userId, body}){
        this.commentId=commentId
        this.ticketId=ticketId
        this.userId=userId
        this.body=body
    }

    static async getAll(){
        const response = await db.query("SELECT * FROM comments;")
        if (response.rows.length === 0) {
            throw Error("No comments available")
        }
        return response.rows.map(comment => new Comment(comment))
    }

    static async getOneByID(comment) {
        const response = await db.query("SELECT * FROM comments WHERE commentId = $1;", [comment])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate comment")
        }
        return new Comment(response.rows[0])
    }

    static async create(data){
        const {ticketId, userId, body} = data

        const existingUser = await db.query("SELECT userId FROM users WHERE userId = $1;", [userId])
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }

        const existingTicket = await db.query("SELECT ticketId FROM tickets WHERE ticketId = $1;", [ticketId])
        if (existingTicket.rows.length === 0) {
            throw Error("A ticket with this ID does not exist")
        }

        const response = await db.query("INSERT INTO comments (ticketId, userId, body) VALUES ($1, $2, $3) RETURNING *;", [ticketId, userId, body])
            return new Comment(response.rows[0])
    }

    async update(data){
        const {ticketId, userId, body} = data
        const response = await db.query("UPDATE comments SET ticketId = $1, userId = $2, body = $3 WHERE RETURNING *;", [ticketId, userId, body])
        if(response.rows.length !== 1){
            throw Error("Unable to locate comment")
        }
        return new Comment(response.rows[0])
    }

    async destroy(){
        try {
            const response = await db.query("DELETE FROM comments WHERE commentId = $1;", [this.commentId])
        } catch (error) {
            throw Error("Cannot delete comment")
        }
    }
}