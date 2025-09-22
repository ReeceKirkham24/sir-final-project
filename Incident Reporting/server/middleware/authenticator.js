const jwt = require('jsonwebtoken')

function authenticator(req, res, next){
    const token = req.headers['authorisation'];

    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN || "test-secret", async (err, data) => {
            if(err){
                res.status(403).json({ err: 'Invalid token' })
            } else {
                if (data.user_id) {
                    req.user_id = data.user_id
                } 
                next();
            }
        })
    } else { 
        res.status(403).json({ err: 'Missing token' })
    }
}

module.exports = {
    authenticator
}

// flow through > user makes req to for example, create a ticket. req goes to authenticator where it pulls out the jwt from req headers and assigns it to local var named token.
// > it then decodes jwt to get original payload, and checks what type of user is making the request. depending on who is making the req > do diff things. in this case, simply 
// create a new ticket under a specific user by assigning a key of user_id to req obj. this data is then parsed into the create controller for ticket.