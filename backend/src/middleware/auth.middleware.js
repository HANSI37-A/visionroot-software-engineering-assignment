const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const authenticate = async ( req, res, next ) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError( 401, "Authentication required");
    }

    let decoded;

    try {
      decoded = jwt.verify( token, process.env.JWT_SECRET );
    } catch (error) {
      throw new ApiError( 401, "Invalid or expired authentication token" );
    }

    const user = await User.findById( decoded.id );

    if (!user) {
      throw new ApiError( 401, "User associated with this token no longer exists" );
    }

    if (!user.isActive) {
      throw new ApiError( 403, "Your account is inactive");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

 const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Forbidden: You do not have permission to perform this action")
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};