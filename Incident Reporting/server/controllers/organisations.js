const Organisation = require('../models/Organisation')


async function showOrg(req, res){
    try{
        const data = req.body
        const response = await Organisation.getOrgById(data.org_id)
        res.status(200).json(response)

    }catch(err){
        res.status(404).json({err: err.message})
    }
}

async function createOrg(req, res){
    try{
        const data = req.body
        const newOrg = await Organisation.createOrg(data)
        res.status(201).json(newOrg)
    }catch(err){
        res.status(400).json({ error: err.message })
    }
}


async function updateOrg(req, res){
    try{

        const data = req.body
        const response = await Organisation.getOrgById(data.org_id)
        const result = await response.changeOrgName(data)
        res.status(200).json(result)
    }catch(err){
        res.status(404).json({error: err.message})
    }

}


async function destroyOrg(req, res){
    try{
        const data = req.body
        const response = await Organisation.getOrgById(data.org_id)
        const result = response.deleteOrganisation()
        res.status(204).end()
        
    }catch(err){
        res.status(404).json({error: err.message})
    }
}

module.exports = { createOrg, updateOrg, destroyOrg, showOrg }