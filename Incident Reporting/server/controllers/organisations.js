const Organisation = require('../models/Organisation')

async function create(req, res){
    try{
        const data = req.body
        const newOrg = await Organisation.createOrg(data)
        res.status(201).json(newOrg)
    }catch(err){
        res.status(400).json({ error: err.message })
    }
}


async function update(req, res){
    try{

        const data = req.body
        const response = await Organisation.getOrgById(data.Org_Id)
        const result = response.changeOrgName(data.Name)
        res.status(200).json(result)
    }catch(err){
        res.status(404).json({error: err.message})
    }

}


async function destroy(req, res){
    try{
        const data = req.body
        const response = await Organisation.getOrgById(data.Org_Id)
        const result = response.deleteOrganisation()
        res.status(204).end()
        
    }catch(err){
        res.status(404).json({error: err.message})
    }
}

module.exports = { create, update, destroy }