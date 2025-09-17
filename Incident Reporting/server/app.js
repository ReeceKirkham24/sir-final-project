const express = require("express");
const cors = require("cors");

const ticketRouter = require('./routers/ticket')
const commentRouter = require('./routers/comment')
const userRouter = require('./routers/users')

const logger = require("./middleware/logger");

const app = express();
app.use(express.json())
app.use(cors());
app.use(logger);

app.use('/ticket', ticketRouter)
app.use('/comment', commentRouter)
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    title: "SIR API",
    description: "Where incidents are reported, stored in a central database, and prioritized automatically"
  })
})


module.exports = app;