const { Router } = require('express')

const commentController = require('../controllers/comment')
const { authenticator } = require('../middleware/authenticator')

const commentRouter = Router()


commentRouter.get('/', commentController.index)
commentRouter.get('/show', commentController.showId)
commentRouter.post('/create', commentController.create)
commentRouter.patch('/update', commentController.update)
commentRouter.delete('/destroy', commentController.destroy)

module.exports = commentRouter