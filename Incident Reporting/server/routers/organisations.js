const { Router } = require('express')

const organisationController = require('../controllers/organisations')
const { authenticator } = require('../middleware/authenticator')


const organisationRouter = Router()

organisationRouter.get('/show', authenticator, organisationController.showOrg)
organisationRouter.post('/create', authenticator, organisationController.createOrg)
organisationRouter.patch('/update', authenticator, organisationController.updateOrg)
organisationRouter.delete('/destroy', authenticator, organisationController.destroyOrg)
organisationRouter.post('/login', authenticator, organisationController.loginOrg)

module.exports = organisationRouter