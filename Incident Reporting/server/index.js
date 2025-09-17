require("dotenv").config();
// for when we use env variables

const app = require('./app');
const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})