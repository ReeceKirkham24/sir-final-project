const { Router } = require('express')

const organisationController = require('../controllers/organisations')

const organisationRouter = Router()

organisationRouter.get('/show', organisationController.showOrg)
organisationRouter.post('/create', organisationController.createOrg)
organisationRouter.patch('/update', organisationController.updateOrg)
organisationRouter.delete('/destroy', organisationController.destroyOrg)

module.exports = organisationRouter