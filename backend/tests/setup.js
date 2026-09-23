require("dotenv").config({ path: ".env.test" });
const mongoose = require("mongoose");

jest.setTimeout(30000);

beforeAll(async () => {
  const testUri =
    process.env.MONGODB_TEST_URI ||
    "mongodb://127.0.0.1:27017/visionroot-se-db-test";
  try {
    const os = require("os");
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testUri, {
        serverSelectionTimeoutMS: 5000,
        runtimeAdapters: { os },
      });
    }
  } catch (error) {
    console.error("MongoDB test connection failed:", error);
    throw error;
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});