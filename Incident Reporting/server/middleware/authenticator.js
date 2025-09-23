const jwt = require('jsonwebtoken')

function authenticator(req, res, next){
    const token = req.headers['authorisation'];
    if (token) {
        try{
            const data = jwt.verify(token, 'test-secret')
            // change this to store secret value in env + maybe do it async
            req.user_id = data.id
            console.log(req.user_id)
            next()
        }catch(err){
            res.status(403).json({ err: 'Invalid token' })
        }
    } else { 
        res.status(403).json({ err: 'Missing token' })
    }
}

module.exports = {
    authenticator
}
