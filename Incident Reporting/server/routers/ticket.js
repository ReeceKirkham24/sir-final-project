const { Router } = require('express')

const ticketController = require('../controllers/ticket')
const { authenticator } = require('../middleware/authenticator')

const ticketRouter = Router()

ticketRouter.get('/', authenticator, ticketController.index) //
ticketRouter.get('/show', authenticator, ticketController.showId) //
ticketRouter.post('/create', authenticator, ticketController.create) 
ticketRouter.patch('/update', authenticator, ticketController.update)
ticketRouter.delete('/destroy', authenticator, ticketController.destroy)

module.exports = ticketRouter