const { Router } = require('express')

const ticketController = require('../controllers/ticket')

const ticketRouter = Router()

ticketRouter.get('/', ticketController.index)
ticketRouter.get('/:id', ticketController.showId)
ticketRouter.post('/', ticketController.create)
ticketRouter.patch('/:id', ticketController.update)
ticketRouter.delete('/:id', ticketController.destroy)

module.exports = ticketRouter