const { Router } = require('express')

const departmentController = require('../controllers/departments')

const departmentRouter = Router()

departmentRouter.get('/', departmentController.index)
departmentRouter.get('/:id', departmentController.show)
departmentRouter.post('/', departmentController.createDep)
departmentRouter.patch('/:id', departmentController.updateDep)
departmentRouter.delete('/:id', departmentController.destroyDep)

module.exports = departmentRouter