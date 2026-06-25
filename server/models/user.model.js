import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes accidental leading/trailing spaces
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      index: true, // Optimizes database lookups for queries filtering by email
    },
    credits: {
      type: Number,
      default: 100,
      min: [0, "Credits cannot be negative"], // Prevents errors where credits drop below zero
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

const User = mongoose.model("User", userSchema);

export default User;
