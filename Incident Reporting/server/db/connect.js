
const { Pool } = require("pg");

const db = new Pool({
    connectionString: process.env.DB_URL
})

// const db = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//   })


console.log("DB connection established.");

module.exports = db;