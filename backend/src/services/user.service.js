const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const getUsers = async ({
  search,
  role,
  isActive,
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  if (search) {
    const escapedSearch =
      search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    filter.$or = [
      {
        name: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        email: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }


  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const [users, totalItems] =
    await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      User.countDocuments(filter),
    ]);


  const totalPages =
    Math.ceil(totalItems / limitNumber);


  return {
    users,

    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalItems,
      totalPages,

      hasNextPage:
        pageNumber < totalPages,

      hasPreviousPage:
        pageNumber > 1,
    },
  };
};

const updateUserStatus = async ({
  userId,
  isActive,
  currentUser,
}) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  if (
    user._id.equals(currentUser._id) &&
    isActive === false
  ) {
    throw new ApiError(
      400,
      "You cannot deactivate your own account"
    );
  }


  user.isActive = isActive;

  await user.save();

  return user;
};


module.exports = {
  getUsers,
  updateUserStatus,
};