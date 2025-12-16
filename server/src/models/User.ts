import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
