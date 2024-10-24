import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

const initiateToken = (userId) => {
  const authToken = jwt.sign({ userId }, process.env.AUTH_SECRET_KEY, {
    expiresIn: "24h",
  });

  const renewToken = jwt.sign({ userId }, process.env.AUTH_SECRET_KEY, {
    expiresIn: "10d",
  });
  return { authToken, renewToken };
};

const saveRenewToken = async (userId, renewToken) => {
  await redis.set(`renew_token:${userId}`, renewToken, "EX", 10 * 24 * 60 * 60);
};

const applyCookies = (res, authToken, renewToken) => {
  res.cookie("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 1000, // 24 hours
  });
  res.cookie("renewToken", renewToken, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 1000, // 10 days
  });
};

export const signUp = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
      return res.status(400).json({ message: "User is already available" });
    }
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    const { authToken, renewToken } = initiateToken(user._id);
    await saveRenewToken(user._id, renewToken);

    applyCookies(res, authToken, renewToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const signIn = async (req, res) => {
  res.send("This is the sign-in route");
};





export const signOut = async (req, res) => {
  try {
  const renewToken = req.cookies.renewToken;
  if (renewToken) {
    const decodedToken = jwt.verify(renewToken, process.env.RENEW_SECRET_KEY);
    const userId = decodedToken.userId;
    await redis.del(`renew_token:${userId}`);
    // Clear the cookies
    res.clearCookie("authToken");
    res.clearCookie("renewToken");
    res.status(200).json({ message: "User signed out successfully" });
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 
};






export const forgotPassword = async (req, res) => {
  res.send("This is the forgot-password route");
};

export const resetPassword = async (req, res) => {
  res.send("This is the reset-password route");
};

export const verifyEmail = async (req, res) => {
  res.send("This is the verify-email route");
};
