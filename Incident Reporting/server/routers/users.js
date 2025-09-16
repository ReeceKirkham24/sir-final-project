const { Router } = require('express')

const usersController = require('../controllers/users')

const usersRouter = Router()

usersRouter.post("/", usersController.create)


module.exports = usersRouter