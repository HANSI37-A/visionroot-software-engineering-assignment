const ServiceRequest =
  require("../models/ServiceRequest");

const ApiError =
  require("../utils/ApiError");

const {
  allowedTransitions,
} = require("../utils/requestStatus");


const createRequest = async ({
  title, description, category, priority, userId, }) => {
  const serviceRequest =
    await ServiceRequest.create({
      title,description,category, priority: priority || "MEDIUM",
      status: "PENDING",
      user: userId,
    });

  return serviceRequest;
};


const getRequests = async ({
  currentUser,
  search,
  status,
  category,
  priority,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  if (currentUser.role !== "ADMIN") {
    filter.user = currentUser._id;
  }

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const sort = { [sortBy]: sortDirection };

  const [requests, totalItems] =
    await Promise.all([
      ServiceRequest.find(filter)
        .populate(
          "user",
          "name email role"
        )
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),

      ServiceRequest.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(totalItems / limitNumber);

  return {
    requests,

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


const getRequestById = async ({
  requestId,
  currentUser,
}) => {
  const serviceRequest =
    await ServiceRequest.findById(
      requestId
    ).populate(
      "user",
      "name email role"
    );

  if (!serviceRequest) {
    throw new ApiError( 404, "Service request not found" );
  }

  const isAdmin =
    currentUser.role === "ADMIN";

  const isOwner =
    serviceRequest.user._id.equals(
      currentUser._id
    );

  if (!isAdmin && !isOwner) {
    throw new ApiError( 403,"You are not authorized to access this request");
  }

  return serviceRequest;
};


const updateRequest = async ({
  requestId,
  currentUser,
  updates,
}) => {
  const serviceRequest =
    await ServiceRequest.findById(
      requestId
    );

  if (!serviceRequest) {
    throw new ApiError(404,"Service request not found" );
  }

  const isOwner =
    serviceRequest.user.equals(
      currentUser._id
    );

  if (!isOwner) {
    throw new ApiError(403, "You are not authorized to edit this request");
  }

  if (
    serviceRequest.status !== "PENDING"
  ) {
    throw new ApiError( 400,"Only pending requests can be edited");
  }

  const allowedFields = [
    "title", "description", "category", "priority",];

  allowedFields.forEach((field) => {
    if (
      updates[field] !== undefined
    ) {
      serviceRequest[field] =
        updates[field];
    }
  });

  await serviceRequest.save();

  return serviceRequest;
};


const cancelRequest = async ({
  requestId, currentUser, }) => {
  const serviceRequest =
    await ServiceRequest.findById(
      requestId
    );

  if (!serviceRequest) {
    throw new ApiError(404, "Service request not found");
  }

  const isOwner =
    serviceRequest.user.equals(
      currentUser._id
    );

  if (!isOwner) {
    throw new ApiError(403, "You are not authorized to cancel this request" );
  }

  if (
    !["PENDING", "IN_PROGRESS"].includes(
      serviceRequest.status
    )
  ) {
    throw new ApiError(400, "This request can no longer be cancelled");
  }

  serviceRequest.status =
    "CANCELLED";

  await serviceRequest.save();

  return serviceRequest;
};


const updateRequestStatus = async ({
  requestId,newStatus, }) => {
  const serviceRequest =
    await ServiceRequest.findById(
      requestId
    );

  if (!serviceRequest) {
    throw new ApiError( 404, "Service request not found" );
  }

  const currentStatus =
    serviceRequest.status;

  const validNextStatuses =
    allowedTransitions[currentStatus] || [];

  if (
    !validNextStatuses.includes(newStatus)
  ) {
    throw new ApiError(
      400,
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }

  serviceRequest.status = newStatus;

  await serviceRequest.save();

  return serviceRequest;
};


module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  cancelRequest,
  updateRequestStatus,
};