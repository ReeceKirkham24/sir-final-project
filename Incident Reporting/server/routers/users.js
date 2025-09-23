const { Router } = require("express");

const userController = require("../controllers/users");
const { authenticator } = require('../middleware/authenticator')

const userRouter = Router();

userRouter.get("/", userController.index);
userRouter.get("/show", authenticator, userController.show);
userRouter.post("/login", userController.login);
userRouter.post("/changepassword", userController.changepassword);
userRouter.post("/create", userController.create);
userRouter.patch("/update", userController.update);
userRouter.delete("/destroy", userController.destroy);

module.exports = userRouter;
