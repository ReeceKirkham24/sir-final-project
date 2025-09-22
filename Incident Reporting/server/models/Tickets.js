const db = require('../db/connect')

class Ticket {
    constructor({ ticket_id, status, text, severity, category, user_id, date_created, date_completed }) {
        this.ticket_id = ticket_id;
        this.status = status;
        this.text = text;
        this.severity = severity;
        this.category = category;
        this.user_id = user_id;
        this.date_created = date_created;
        this.date_completed = date_completed;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM tickets;");
        if (response.rows.length === 0) {
            throw Error("No tickets available");
        }
        return response.rows.map(ticket => new Ticket(ticket));
    }

    static async getOneByID(ticket_id) {
        const response = await db.query("SELECT * FROM tickets WHERE ticket_id = $1;", [ticket_id]);
        if (response.rows.length !== 1) {
            throw Error("Unable to locate ticket");
        }
        return new Ticket(response.rows[0]);
    }

    static async create(data) {
        const { status, text, severity, category, user_id, date_created, date_completed} = data;
        const existingUser = await db.query("SELECT user_id FROM \"user\" WHERE user_id = $1;", [user_id]);
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist");
        }
        const response = await db.query(
            'INSERT INTO tickets (status, text, severity, category, user_id, date_created, date_completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
            [status, text, severity, category, user_id, date_created, date_completed]
        );
        return new Ticket(response.rows[0]);
    }

    async update(data) {
        const { status=this.status, text=this.text, severity=this.severity, category=this.category, user_id=this.user_id, date_created=this.date_created} = data;
        let date_completed=null

        if(status.toLowerCase()=="closed"){
            date_completed = new Date().toISOString();
            console.log(date_completed);
        }
        
        console.log({ status, text, severity, category, user_id, date_created, date_completed });
        const response = await db.query(
            'UPDATE tickets SET status = $1, text = $2, severity = $3, category = $4, user_id = $5, date_created = $6, date_completed = $7 WHERE ticket_id = $8 RETURNING *;',
            [status, text, severity, category, user_id, date_created, date_completed, this.ticket_id]
        );
        if (response.rows.length !== 1) {
            throw Error("Unable to update ticket");
        }
        return new Ticket(response.rows[0]);
    }
    
    async destroy() {
        try {
            await db.query('DELETE FROM tickets WHERE ticket_id = $1;', [this.ticket_id]);
        } catch (error) {
            throw Error("Cannot delete ticket");
        }
    }
}
module.exports = Ticket