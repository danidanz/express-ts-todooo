import Todo, { ITodo } from "../models/todo.schema";

class TodoRepository {
  async create(todo: Partial<ITodo>): Promise<ITodo> {
    const newTodo = new Todo(todo);
    return newTodo.save();
  }

  async findAll(userId: string): Promise<ITodo[]> {
    return Todo.find({ userId });
  }

  async findById(id: string, userId: string): Promise<ITodo | null> {
    return Todo.findOne({ _id: id, userId });
  }

  async update(
    id: string,
    updatedTodo: Partial<ITodo>,
    userId: string
  ): Promise<ITodo | null> {
    return Todo.findOneAndUpdate({ _id: id, userId }, updatedTodo, {
      new: true,
    });
  }

  async delete(id: string, userId: string): Promise<ITodo | null> {
    return Todo.findOneAndDelete({ _id: id, userId });
  }
}

export default new TodoRepository();
