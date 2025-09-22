const { Router } = require('express')

const departmentController = require('../controllers/departments')

const departmentRouter = Router()

departmentRouter.get('/', departmentController.index)
departmentRouter.get('/show', departmentController.show)
departmentRouter.post('/create', departmentController.createDep)
departmentRouter.patch('/update', departmentController.updateDep)
departmentRouter.delete('/destroy', departmentController.destroyDep)

module.exports = departmentRouter