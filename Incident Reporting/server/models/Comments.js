const db = require('../db/connect')

class Comment{
    constructor({commentid, ticketid, userid, body}){
        this.commentid=commentid
        this.ticketid=ticketid
        this.userid=userid
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
        const response = await db.query("SELECT * FROM comments WHERE commentid = $1;", [comment])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate comment")
        }
        return new Comment(response.rows[0])
    }

    static async create(data){
        const {ticketid, userid, body} = data

        const existingUser = await db.query("SELECT userid FROM users WHERE userid = $1;", [userid])
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }

        const existingTicket = await db.query("SELECT ticketid FROM tickets WHERE ticketid = $1;", [ticketid])
        if (existingTicket.rows.length === 0) {
            throw Error("A ticket with this ID does not exist")
        }

        const response = await db.query("INSERT INTO comments (ticketid, userid, body) VALUES ($1, $2, $3) RETURNING *;", [ticketid, userid, body])
            return new Comment(response.rows[0])
    }

    async update(data){
        const {ticketid, userid, body} = data
        const response = await db.query("UPDATE comments SET ticketid = $1, userid = $2, body = $3 WHERE RETURNING *;", [ticketid, userid, body])
        if(response.rows.length !== 1){
            throw Error("Unable to locate comment")
        }
        return new Comment(response.rows[0])
    }

    async destroy(){
        try {
            const response = await db.query("DELETE FROM comments WHERE commentid = $1;", [this.commentid])
        } catch (error) {
            throw Error("Cannot delete comment")
        }
    }
}

module.exports = Comment