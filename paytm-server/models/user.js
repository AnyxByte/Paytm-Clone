import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required for account creation"],
      unique: [true, "email already exists"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid email address",
      ],
      index: true,
    },
    name: {
      type: String,
      required: [true, "name is required for account creation"],
    },
    password: {
      type: String,
      required: [true, "password is required for account creation"],
      minlength: [6, "password should have minimum of 6 characters"],
      select: false,
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
      select: false,
    },
    phone: {
      type: Number,
      required: [true, "number is required for account creation"],
      unique: [true, "number already exists"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);

export default User;
