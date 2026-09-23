const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [
        3,
        "Title must be at least 3 characters",
      ],
      maxlength: [
        150,
        "Title cannot exceed 150 characters",
      ],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [
        10,
        "Description must be at least 10 characters",
      ],
      maxlength: [
        2000,
        "Description cannot exceed 2000 characters",
      ],
    },

    category: {
      type: String,
      enum: [
        "TECHNICAL",
        "BILLING",
        "ACCOUNT",
        "OTHER",
      ],
      required: [true, "Category is required"],
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "IN_PROGRESS",
        "RESOLVED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true,
  }
);

serviceRequestSchema.index({ user: 1 });
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ category: 1 });
serviceRequestSchema.index({ priority: 1 });
serviceRequestSchema.index({ createdAt: -1 });

const ServiceRequest = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);

module.exports = ServiceRequest;