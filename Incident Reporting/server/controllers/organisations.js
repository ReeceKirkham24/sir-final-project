const Organisation = require('../models/Organisation')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')


async function showOrg(req, res){
    try{
        const org_id = req.user_id
        const response = await Organisation.getOrgById(org_id)
        res.status(200).json(response)
        
    }catch(err){
        res.status(404).json({err: err.message})
    }
}

async function loginOrg(req, res){
    try{
        const data = req.body
        const response = await Organisation.login(data)
        let message
        const tokenObj = {
            token: 'x'
        }
        if(response.match == true){
            message = "Correct Details: User has been granted access."
            const orgToken = jwt.sign({ id: response.id}, 'test-secret', {
                expiresIn: "1h"
            })
            tokenObj.token = orgToken
        }else{
            message = "Incorrect Details: Access Denied"    
        }
        res.status(200).json(tokenObj)
    }catch(err){
        res.status(404).json({error: err.message})
    }
}

async function createOrg(req, res){
    try{
        const data = req.body
        const hashedPass = await bcrypt.hash(data.password_hash, 4)
        data.password_hash = hashedPass
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



module.exports = { createOrg, updateOrg, destroyOrg, showOrg, loginOrg }