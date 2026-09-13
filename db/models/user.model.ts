import { IAddress, IUserInput } from "@/types";
import mongoose, { Document, Model, Schema, Types } from "mongoose";
const { model, models } = mongoose;

export interface IUser extends Document, IUserInput {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  addresses: Types.DocumentArray<Omit<IAddress, "_id">>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: "User" },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    addresses: [
      {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, required: true, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default User;
