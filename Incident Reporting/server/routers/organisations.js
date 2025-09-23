const { Router } = require('express')

const organisationController = require('../controllers/organisations')
const { authenticator } = require('../middleware/authenticator')


const organisationRouter = Router()

organisationRouter.get('/show', authenticator, organisationController.showOrg)
organisationRouter.post('/create', organisationController.createOrg)
organisationRouter.patch('/update', authenticator, organisationController.updateOrg)
organisationRouter.delete('/destroy', authenticator, organisationController.destroyOrg)
organisationRouter.post('/login', organisationController.loginOrg)

module.exports = organisationRouter