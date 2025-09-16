const User = require('../models/User')

async function create(req, res){
    try{
        const data = req.body
        const newUser = await User.createUser(data)
        res.status(201).json(newUser)
    }catch{
        res.status(400).json({ error: err.message })
    }
}