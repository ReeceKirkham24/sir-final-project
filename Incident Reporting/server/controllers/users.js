const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')



async function index(req, res) {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function show(req, res) {
    try {
        const data = req.body
        const user = await User.getOneByUserId(data.user_id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json({ error : err.message });
    }
}

async function create(req, res) {
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    data["password_hash"] = await bcrypt.hash(data.password_hash, salt);
    const newUser = await User.create(data);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
  const email = req.body.email
  const password = req.body.password

  
  const response = await User.checkUser(email, password)
  console.log(response)
  let message
  const tokenobj = {
    token: 'x'
  }
  if (response.match === true){
    message = "Correct Details: User has been granted access"
    const userToken = jwt.sign({id: response.id}, 'test-secret', {
      expiresIn: "1h"
    })
    tokenobj.token = userToken
  }
  if (response.match === false){
    message = "Incorrect Details: Access Denied"
  }
  res.status(200).json(tokenobj);
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}




async function update (req, res) {
    try {
        // const name = req.params.name;
        const data = req.body;
        const user = await User.getOneByUserId(data.user_id);
        const result = await user.update(data);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}

async function destroy (req, res) {
    try {
        const data = req.body
        const user = await User.getOneByUserId(data.user_id)
        const result = await user.destroy(data)
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    show,
    login,
    create,
    update,
    destroy
}
