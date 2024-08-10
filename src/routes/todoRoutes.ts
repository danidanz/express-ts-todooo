import { Router } from "express";
import todoController from "../controllers/todoController";
import { auth } from "../middlewares/authMiddleware";

const todoRoutes = Router();

todoRoutes.post("/todos", auth, todoController.create);
todoRoutes.get("/todos", auth, todoController.getAll);
todoRoutes.get("/todos/:id", auth, todoController.getById);
todoRoutes.put("/todos/:id", auth, todoController.update);
todoRoutes.delete("/todos/:id", auth, todoController.delete);

export default todoRoutes;
