const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Service Request Management API",
      version: "1.0.0",
      description:
        "REST API for the Service Request Management System built using Node.js, Express and MongoDB.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
      {
        name: "Service Requests",
        description: "Service request management",
      },
      {
        name: "Users",
        description: "Admin user management",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description:
            "JWT authentication token stored in an HttpOnly cookie.",
        },
      },

      schemas: {
        User: {
          type: "object",

          properties: {
            _id: {
              type: "string",
              example: "68d123456789abcdef123456",
            },

            name: {
              type: "string",
              example: "Hansi Tharaki",
            },

            email: {
              type: "string",
              format: "email",
              example: "hansi@example.com",
            },

            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              example: "USER",
            },

            isActive: {
              type: "boolean",
              example: true,
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ServiceRequest: {
          type: "object",

          properties: {
            _id: {
              type: "string",
              example: "68d123456789abcdef123456",
            },

            title: {
              type: "string",
              example: "Cannot access my account",
            },

            description: {
              type: "string",
              example:
                "I cannot access my account after changing my password.",
            },

            category: {
              type: "string",
              enum: [
                "TECHNICAL",
                "BILLING",
                "ACCOUNT",
                "OTHER",
              ],
              example: "ACCOUNT",
            },

            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              example: "HIGH",
            },

            status: {
              type: "string",
              enum: [
                "PENDING",
                "IN_PROGRESS",
                "RESOLVED",
                "CANCELLED",
              ],
              example: "PENDING",
            },

            user: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  $ref: "#/components/schemas/User",
                },
              ],
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },

            message: {
              type: "string",
              example: "Validation failed",
            },

            errors: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.js",
  ],
};

const swaggerSpec =
  swaggerJsdoc(options);

module.exports = swaggerSpec;