const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const registerUser = async ({
  name,
  email,
  password,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      409,
      "A user with this email already exists"
    );
  }

  const user = await User.create({
    name, email,password,
  });

  const token = generateToken(user);

  return {
   user, token,
  };
};

const loginUser = async ({
  email, password,
}) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account is inactive"
    );
  }

  const passwordMatches =
    await user.comparePassword(password);

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const token = generateToken(user);

  return {
    user, token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account is inactive"
    );
  }

  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getCurrentUser,
};