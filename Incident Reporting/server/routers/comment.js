const { Router } = require('express')

const commentController = require('../controllers/ticket')

const commentRouter = Router()

commentRouter.get('/', commentController.index)
commentRouter.get('/:id', commentController.showId)
commentRouter.post('/', commentController.create)
commentRouter.patch('/:id', commentController.update)
commentRouter.delete('/:id', commentController.destroy)

module.exports = commentRouter