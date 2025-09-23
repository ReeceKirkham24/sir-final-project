const Ticket = require('../models/Tickets')

async function index(req, res) {
    try {
        const db = require('../db/connect');
        const userId = req.user_id;
        const userResult = await db.query('SELECT org_id FROM "user" WHERE user_id = $1;', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const orgId = userResult.rows[0].org_id;
        const tickets = await Ticket.getAll(orgId);
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const ticket = await Ticket.getOneByID(id)
        res.status(200).json(ticket)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const id = req.user_id
        const newTicket = await Ticket.create(data, id)
        // create a ticket parsing the ticket's details into data, and the user creating ticket into id
        res.status(201).json(newTicket)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const ticket = await Ticket.getOneByID(id)
        const result = await ticket.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const ticket = await Ticket.getOneByID(id)
        await ticket.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    showId,
    create,
    update,
    destroy
}