const { Router } = require('express')

const departmentController = require('../controllers/departments')
const { authenticator } = require('../middleware/authenticator')

const departmentRouter = Router()

departmentRouter.get('/', authenticator, departmentController.index)
departmentRouter.get('/show', authenticator, departmentController.show)
departmentRouter.post('/create', authenticator, departmentController.createDep)
departmentRouter.patch('/update', authenticator, departmentController.updateDep)
departmentRouter.delete('/destroy', authenticator, departmentController.destroyDep)

module.exports = departmentRouter