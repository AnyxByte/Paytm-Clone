import { sendEmail } from "../config/email.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const handleUserRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        msg: "missing fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        msg: "user already exists",
      });
    }

    let user = await User.create({
      email,
      name,
      password,
      phone,
    });

    sendEmail(email, "Registration Successful");

    user = {
      ...user._doc,
      password: undefined,
    };

    const token = jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
    );

    res.cookie("token", token);

    return res.status(201).json({
      token,
      msg: "registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log("handleregister error:-", error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "missing fields",
      });
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        msg: "user doesnt exists",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(400).json({
        msg: "invalid credentials",
      });
    }

    user = {
      ...user._doc,
      password: undefined,
    };

    const token = jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
    );

    res.cookie("token", token);

    return res.status(200).json({
      token,
      msg: "loggedin successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("handleUserLogin error:-", error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};
