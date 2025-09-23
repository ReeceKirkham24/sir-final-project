const db = require('../db/connect')

class Comment{
    constructor({comment_id, ticket_id, user_id, body}){
        this.comment_id=comment_id
        this.ticket_id=ticket_id
        this.user_id=user_id
        this.body=body
    }

    static async getAll(){
        const response = await db.query(`
            SELECT c.*, u.name AS user_name
            FROM comments c
            JOIN "user" u ON c.user_id = u.user_id;
        `)
        if (response.rows.length === 0) {
            throw Error("No comments available")
        }
        return response.rows.map(comment => {
            // Attach user_name to the comment object
            return { ...new Comment(comment), user_name: comment.user_name }
        })
    }

    static async getOneByID(comment) {
        const response = await db.query("SELECT * FROM comments WHERE comment_id = $1;", [comment])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate comment")
        }
        return new Comment(response.rows[0])
    }

    static async create(data, user_id){
        const {ticket_id, body} = data

        const existingUser = await db.query("SELECT user_id FROM \"user\" WHERE user_id = $1;", [user_id])
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }

        const existingTicket = await db.query("SELECT ticket_id FROM tickets WHERE ticket_id = $1;", [ticket_id])
        if (existingTicket.rows.length === 0) {
            throw Error("A ticket with this ID does not exist")
        }

        const response = await db.query("INSERT INTO comments (ticket_id, user_id, body) VALUES ($1, $2, $3) RETURNING *;", [ticket_id, user_id, body])
            return new Comment(response.rows[0])
    }

    async update(data){
        // ! THIS IS PROB GONNA BREAK - DID NOT CHANGE TO WORK WITH AUTHENTICATOR > DATA BEING PARSED INTO THIS IS PROB INCORRECT
        const {ticket_id=this.ticket_id, user_id=this.user_id, body=this.body} = data
        const response = await db.query("UPDATE comments SET ticket_id = $1, user_id = $2, body = $3 WHERE comment_id = $4 RETURNING *;", [ticket_id, user_id, body, this.comment_id])
        console.log(response);
        if(response.rows.length !== 1){
            throw Error("Unable to locate comment")
        }
        return new Comment(response.rows[0])
    }

    async destroy(){
        try {
            const response = await db.query("DELETE FROM comments WHERE comment_id = $1;", [this.comment_id])
        } catch (error) {
            throw Error("Cannot delete comment")
        }
    }
}

module.exports = Comment