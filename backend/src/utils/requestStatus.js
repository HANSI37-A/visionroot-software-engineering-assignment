const allowedTransitions = {
  PENDING: [
    "IN_PROGRESS",
    "CANCELLED",
  ],

  IN_PROGRESS: [
    "RESOLVED",
    "CANCELLED",
  ],

  RESOLVED: [],

  CANCELLED: [],
};

module.exports = {
  allowedTransitions,
};