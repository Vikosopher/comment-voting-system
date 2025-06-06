// services/authService.js
const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../config/jwt");
const jwt = require("jsonwebtoken");

const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const user = await User.create({ username, email, password });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

const handleRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      accessToken: generateAccessToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
};
