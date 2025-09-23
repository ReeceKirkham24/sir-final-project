const { Router } = require("express");

const userController = require("../controllers/users");
const { authenticator } = require('../middleware/authenticator')

const userRouter = Router();

userRouter.get("/", userController.index);
userRouter.get("/show",  userController.show);
userRouter.post("/login", userController.login);
userRouter.post("/changepassword", userController.changepassword);
userRouter.post("/create", userController.create);
userRouter.patch("/update", authenticator, userController.update);
userRouter.delete("/destroy", authenticator, userController.destroy);

module.exports = userRouter;
