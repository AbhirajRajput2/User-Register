import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

// REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production (https)
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Registered successfully",
      user
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};


// LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "Not registered" });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      user
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (_: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

