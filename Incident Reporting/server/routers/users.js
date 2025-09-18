const { Router } = require("express");

const userController = require("../controllers/users");

const userRouter = Router();

userRouter.get("/", userController.index);
userRouter.get("/:name", userController.show);
userRouter.post("/", userController.create);
userRouter.patch("/", userController.update);
userRouter.delete("/:name", userController.destroy);

module.exports = userRouter;
