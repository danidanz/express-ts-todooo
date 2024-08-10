import { Request, Response } from "express";
import todoService from "../services/todoService";

class TodoController {
  async create(req: Request, res: Response) {
    try {
      const { title } = req.body;
      const userId = req.body.userId;
      const todo = await todoService.createTodo(title, userId);
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const todos = await todoService.getTodos(userId);
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ msg: "Unauthorized, userId not found" });
      }
      const todo = await todoService.getTodoById(id, userId);
      if (!todo) {
        return res.status(404).json({ msg: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;
      const userId = req.body.userId;
      const todo = await todoService.updateTodo(id, title, completed, userId);
      if (!todo) {
        return res.status(404).json({ msg: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      const todo = await todoService.deleteTodo(id, userId);
      if (!todo) {
        return res.status(404).json({ msg: "Todo not found" });
      }
      res.json({ msg: "Todo removed" });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
}

export default new TodoController();
