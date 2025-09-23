const { Router } = require('express')

const commentController = require('../controllers/comment')
const { authenticator } = require('../middleware/authenticator')

const commentRouter = Router()


commentRouter.get('/', authenticator, commentController.index)
commentRouter.get('/show', authenticator, commentController.showId)
commentRouter.post('/create', authenticator, commentController.create)
commentRouter.patch('/update', authenticator, commentController.update)
commentRouter.delete('/destroy', authenticator, commentController.destroy)

module.exports = commentRouter