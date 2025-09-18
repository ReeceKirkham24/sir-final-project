const { Router } = require("express");

const userController = require("../controllers/users");

const userRouter = Router();

userRouter.get("/", userController.index);
userRouter.get("/show", userController.show);
userRouter.post("/create", userController.create);
userRouter.patch("/update", userController.update);
userRouter.delete("/destroy", userController.destroy);

module.exports = userRouter;
