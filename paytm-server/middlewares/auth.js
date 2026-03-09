import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        msg: "unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    next();
  } catch (error) {
    console.log("error in auth middleware", error);
    return res.status(401).json({
      msg: "unauthorized",
    });
  }
};

export const authSystemUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        msg: "unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.user._id).select("+systemUser");

    if (!user.systemUser) {
      return res.status(403).json({
        msg: "unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in authSystemUser middleware", error);
    return res.status(500).json({
      msg: "unauthorized",
    });
  }
};
