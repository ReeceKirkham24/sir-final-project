const { Router } = require("express");

const userController = require("../controllers/users");
const { authenticator } = require('../middleware/authenticator')

const userRouter = Router();

userRouter.get("/", authenticator, userController.index);
userRouter.get("/show", authenticator, userController.show);
userRouter.post("/login", authenticator, userController.login);
userRouter.post("/create", authenticator, userController.create);
userRouter.patch("/update", authenticator, userController.update);
userRouter.delete("/destroy", authenticator, userController.destroy);

module.exports = userRouter;
