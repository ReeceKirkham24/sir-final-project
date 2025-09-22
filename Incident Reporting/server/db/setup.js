require('dotenv').config()

const fs = require('fs')

const db = require('./connect')
const sql = fs.readFileSync('Incident Reporting/server/db/setup.sql').toString()


db.query(sql)
    .then((data) =>{
        db.end()
        console.log("Setup complete")
    })
    .catch((error) =>console.log(error))

    