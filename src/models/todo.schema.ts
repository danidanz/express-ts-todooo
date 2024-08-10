import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  userId: string;
}

const TodoSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, ref: "User", required: true },
});

export default mongoose.model<ITodo>("Todo", TodoSchema);
