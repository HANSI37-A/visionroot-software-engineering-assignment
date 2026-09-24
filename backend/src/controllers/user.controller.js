const {
  getUsers,
  updateUserStatus,
} = require("../services/user.service");


const listUsers = async (
  req, res, next ) => {
  try {
    const {
      search, role, isActive, page, limit,
    } = req.query;

     const result = await getUsers({
      search,
      role,
      isActive,
      page,
      limit,
    });


    return res.status(200).json({
      success: true,

      data: {
        users: result.users,
      },

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


const updateUser = async ( req, res, next ) => {
  try {
    const user =
      await updateUserStatus({
        userId: req.params.id,
        isActive: req.body.isActive,
        currentUser: req.user,
      });


    return res.status(200).json({
      success: true,

      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  listUsers,
  updateUser,
};