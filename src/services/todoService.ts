import todoRepository from "../repositories/todoRepository";
import { ITodo } from "../models/todo.schema";

class TodoService {
  async createTodo(title: string, userId: string): Promise<ITodo> {
    return todoRepository.create({ title, userId });
  }

  async getTodos(userId: string): Promise<ITodo[]> {
    return todoRepository.findAll(userId);
  }

  async getTodoById(id: string, userId: string): Promise<ITodo | null> {
    return todoRepository.findById(id, userId);
  }

  async updateTodo(
    id: string,
    title: string,
    completed: boolean,
    userId: string
  ): Promise<ITodo | null> {
    return todoRepository.update(id, { title, completed }, userId);
  }

  async deleteTodo(id: string, userId: string): Promise<ITodo | null> {
    return todoRepository.delete(id, userId);
  }
}

export default new TodoService();
