const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");

const app = express();
app.use(express.json())
app.use(cors());
app.use(logger);

app.get("/", (req, res) => {
  res.status(200).json({
    title: "SIR API",
    description: "Where incidents are reported, stored in a central database, and prioritized automatically"
  })
})

app.use("/user", userRouter);

module.exports = app;