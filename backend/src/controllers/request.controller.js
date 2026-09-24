const { createRequest, getRequests, getRequestById, updateRequest, cancelRequest, updateRequestStatus, } = require("../services/request.service");


const create = async (
  req, res, next ) => {
  try {
    const {
      title,description,category,priority,} = req.body;

    const serviceRequest =
      await createRequest({
        title,
        description,
        category,
        priority,
        userId: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Service request created successfully",
      data: {
        request: serviceRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};


const list = async ( req, res, next ) => {
  try {
    const {
      search,
      status,
      category,
      priority,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const result =
      await getRequests({
        currentUser: req.user,
        search,
        status,
        category,
        priority,
        sortBy,
        sortOrder,
        page,
        limit,
      });

    return res.status(200).json({
      success: true,

      data: {
        requests: result.requests,
      },

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


const getOne = async ( req, res, next ) => {
  try {
    const serviceRequest =
      await getRequestById({
        requestId: req.params.id,
        currentUser: req.user,
      });

    return res.status(200).json({
      success: true,

      data: {
        request: serviceRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};


const update = async ( req, res, next ) => {
  try {
    const serviceRequest =
      await updateRequest({
        requestId: req.params.id,
        currentUser: req.user,

        updates: {
          title: req.body.title,
          description:
            req.body.description,
          category: req.body.category,
          priority: req.body.priority,
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Service request updated successfully",

      data: {
        request: serviceRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};


const cancel = async (req,res,next
) => {
  try {
    const serviceRequest =
      await cancelRequest({
        requestId: req.params.id,
        currentUser: req.user,
      });

    return res.status(200).json({
      success: true,
      message:
        "Service request cancelled successfully",

      data: {
        request: serviceRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};


const changeStatus = async (
  req,
  res,
  next
) => {
  try {
    const serviceRequest =
      await updateRequestStatus({
        requestId: req.params.id,
        newStatus: req.body.status,
      });

    return res.status(200).json({
      success: true,
      message:
        "Request status updated successfully",

      data: {
        request: serviceRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  create,
  list,
  getOne,
  update,
  cancel,
  changeStatus,
};