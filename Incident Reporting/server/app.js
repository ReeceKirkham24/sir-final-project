const express = require("express");
const cors = require("cors");


const logger = require("./middleware/logger");

const ticketRouter = require('./routers/ticket')
const commentRouter = require('./routers/comment')
const organisationRouter = require("./routers/organisations");
const userRouter = require("./routers/users");
const departmentRouter = require("./routers/department");

const app = express();
app.use(express.json())
app.use(cors());
app.use(logger);

app.use('/ticket', ticketRouter)
app.use('/comment', commentRouter)
app.use("/user", userRouter);
app.use("/organisation", organisationRouter);
app.use('/department', departmentRouter)

app.get("/", (req, res) => {
  res.status(200).json({
    title: "SIR API",
    description: "Where incidents are reported, stored in a central database, and prioritized automatically"
  })
})


module.exports = app;