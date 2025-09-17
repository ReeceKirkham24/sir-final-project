const { Router } = require('express')

const organisationController = require('../controllers/organisations')

const organisationRouter = Router()

organisationRouter.get('/:id', organisationController.showOrg)
organisationRouter.post('/', organisationController.createOrg)
organisationRouter.patch('/:id', organisationController.updateOrg)
organisationRouter.delete('/:id', organisationController.destroyOrg)

module.exports = organisationRouter