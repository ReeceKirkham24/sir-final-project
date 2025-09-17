const Ticket = require('../models/Tickets')

async function index(req, res) {
    try {
        const tickets = await Ticket.getAll()
        res.status(200).json(tickets)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const ticket = await Ticket.getOneByID(id)
        res.status(200).json(ticket)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newTicket = await Ticket.create(data)
        res.status(201).json(newTicket)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const ticket = await Ticket.getOneByID(id)
        const result = await ticket.update(data)
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const ticket = await Ticket.getOneByID(id)
        await ticket.destroy()
        res.status(204).end()
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

module.exports = {
    index,
    showId,
    create,
    update,
    destroy
}