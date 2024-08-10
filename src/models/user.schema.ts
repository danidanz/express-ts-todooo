import { model, Schema } from "mongoose";

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = model("User", userSchema);
