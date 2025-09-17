const Department = require('../models/Department')

async function index(req, res){
    try{
        const data = req.body
        const response = await Department.getAll(data.Org_Id)
        res.status(200).json(response)
    }catch(err){
        res.status(404).json({ err: err.message })
    }
}


async function show(req, res){
    try{
        const data = req.body
        const response = await Department.getDepById(data.Department_Id)
        res.status(200).json(response)

    }catch(err){
        res.status(404).json({ err: err.message })
    }
}



async function createDep(req, res){
    try{
        const data = req.body
        const response = await Department.createDep(data.Org_Id)
        res.status(201).json(response)
        
    }catch(err){
        res.status(400).json({ err: err.message })
    }
}


async function updateDep(req, res){
    try{
        const data = req.body
        const response = await Department.getDepById(data.Department_Id)
        const result = await response.update(data.Name)
        res.status(200).json(result)
    }catch(err){
        res.status(400).json({err: err.message})
    }
}

async function destroyDep(req, res){
     try{
        const data = req.body
        const response = await Department.getDepById(data.Department_Id)
        const result = response.end()
        res.status(204).end()
        
    }catch(err){
        res.status(400).json({ err: err.message })
    }
}





module.exports = { index, show, createDep, destroyDep, updateDep }