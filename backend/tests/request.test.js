const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/User");
const ServiceRequest = require("../src/models/ServiceRequest");


describe("Service Request API", () => {
  let userAAgent;
  let userBAgent;
  let adminAgent;

  let userA;
  let userB;
  let admin;

  beforeEach(async () => {
    await ServiceRequest.deleteMany({});
    await User.deleteMany({});

    userAAgent = request.agent(app);

    const userARegisterResponse =
      await userAAgent
        .post("/api/auth/register")
        .send({
          name: "User A",
          email: "usera@example.com",
          password: "Password123",
        });

    expect(
      userARegisterResponse.statusCode
    ).toBe(201);

    userA = await User.findOne({
      email: "usera@example.com",
    });

    expect(userA).not.toBeNull();

    userBAgent = request.agent(app);

    const userBRegisterResponse =
      await userBAgent
        .post("/api/auth/register")
        .send({
          name: "User B",
          email: "userb@example.com",
          password: "Password123",
        });

    expect(
      userBRegisterResponse.statusCode
    ).toBe(201);

    userB = await User.findOne({
      email: "userb@example.com",
    });

    expect(userB).not.toBeNull();

    adminAgent = request.agent(app);

    const adminRegisterResponse =
      await adminAgent
        .post("/api/auth/register")
        .send({
          name: "Admin User",
          email: "admin@example.com",
          password: "Password123",
        });

    expect(
      adminRegisterResponse.statusCode
    ).toBe(201);

    admin = await User.findOne({
      email: "admin@example.com",
    });

    expect(admin).not.toBeNull();

    admin.role = "ADMIN";

    await admin.save();
  });

  describe("Authentication protection", () => {
    it("should reject unauthenticated request listing", async () => {
      const response = await request(app)
        .get("/api/requests");

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });


    it("should reject unauthenticated request creation", async () => {
      const response = await request(app)
        .post("/api/requests")
        .send({
          title: "Unauthorized request",
          description:
            "This request should not be created.",
          category: "TECHNICAL",
          priority: "HIGH",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/requests", () => {
    it("should create a new service request", async () => {
      const response =
        await userAAgent
          .post("/api/requests")
          .send({
            title: "Cannot access account",
            description:
              "I cannot access my account after changing my password.",
            category: "ACCOUNT",
            priority: "HIGH",
          });

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect( response.body.data.request.title
      ).toBe("Cannot access account");

      expect(  response.body.data.request.category
      ).toBe("ACCOUNT");

      expect( response.body.data.request.priority
      ).toBe("HIGH");

      expect( response.body.data.request.status
      ).toBe("PENDING");

      expect( response.body.data.request.user.toString()
      ).toBe(userA._id.toString());
    });


    it("should use MEDIUM as default priority", async () => {
      const response =
        await userAAgent
          .post("/api/requests")
          .send({
            title: "Technical problem",
            description:
              "There is a technical problem with the system.",
            category: "TECHNICAL",
          });

      expect(response.statusCode).toBe(201);

      expect( response.body.data.request.priority ).toBe("MEDIUM");
    });


    it("should force status to PENDING and ignore client-sent status", async () => {
      const response =
        await userAAgent
          .post("/api/requests")
          .send({
            title: "Status manipulation test",
            description:
              "Testing whether the server controls request status.",
            category: "TECHNICAL",
            priority: "HIGH",
            status: "RESOLVED",
          });

      expect(response.statusCode).toBe(201);

      expect(  response.body.data.request.status ).toBe("PENDING");
    });


    it("should force ownership to authenticated user and ignore client-sent user", async () => {
      const response =
        await userAAgent
          .post("/api/requests")
          .send({
            title: "Ownership test",
            description:
              "Testing whether the server controls request ownership.",
            category: "ACCOUNT",
            priority: "MEDIUM",
            user: userB._id.toString(),
          });

      expect(response.statusCode).toBe(201);

      expect(
        response.body.data.request.user.toString()
      ).toBe(userA._id.toString());
    });


    it("should reject invalid request data", async () => {
      const response =
        await userAAgent
          .post("/api/requests")
          .send({
            title: "",
            description: "short",
            category: "INVALID_CATEGORY",
            priority: "SUPER_HIGH",
          });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe(
        "Validation failed"
      );

      expect(
        Array.isArray(response.body.errors)
      ).toBe(true);
    });
  });

  describe("GET /api/requests", () => {
    it("should only return current user's requests for USER role", async () => {
      await ServiceRequest.create({
        title: "User A request",
        description:
          "This request belongs to User A.",
        category: "TECHNICAL",
        priority: "HIGH",
        user: userA._id,
      });

      await ServiceRequest.create({
        title: "User B request",
        description:
          "This request belongs to User B.",
        category: "BILLING",
        priority: "LOW",
        user: userB._id,
      });

      const response =
        await userAAgent
          .get("/api/requests");

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(
        response.body.data.requests
      ).toHaveLength(1);

      expect(
        response.body.data.requests[0].title
      ).toBe("User A request");
    });


    it("should allow ADMIN to see all users' requests", async () => {
      await ServiceRequest.create({
        title: "User A request",
        description:
          "This request belongs to User A.",
        category: "TECHNICAL",
        priority: "HIGH",
        user: userA._id,
      });

      await ServiceRequest.create({
        title: "User B request",
        description:
          "This request belongs to User B.",
        category: "ACCOUNT",
        priority: "LOW",
        user: userB._id,
      });

      const response =
        await adminAgent
          .get("/api/requests");

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(2);

      expect(
        response.body.pagination.totalItems
      ).toBe(2);
    });


    it("should filter requests by status", async () => {
      await ServiceRequest.create([
        {
          title: "Pending request",
          description:
            "This request is currently pending.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        },
        {
          title: "Resolved request",
          description:
            "This request has already been resolved.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "RESOLVED",
          user: userA._id,
        },
      ]);

      const response =
        await userAAgent
          .get(
            "/api/requests?status=PENDING"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(1);

      expect(
        response.body.data.requests[0].status
      ).toBe("PENDING");
    });


    it("should filter requests by category", async () => {
      await ServiceRequest.create([
        {
          title: "Technical request",
          description:
            "This is a technical service request.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          user: userA._id,
        },
        {
          title: "Billing request",
          description:
            "This is a billing service request.",
          category: "BILLING",
          priority: "MEDIUM",
          user: userA._id,
        },
      ]);

      const response =
        await userAAgent
          .get(
            "/api/requests?category=TECHNICAL"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(1);

      expect(
        response.body.data.requests[0].category
      ).toBe("TECHNICAL");
    });


    it("should filter requests by priority", async () => {
      await ServiceRequest.create([
        {
          title: "High priority request",
          description:
            "This is a high priority service request.",
          category: "TECHNICAL",
          priority: "HIGH",
          user: userA._id,
        },
        {
          title: "Low priority request",
          description:
            "This is a low priority service request.",
          category: "TECHNICAL",
          priority: "LOW",
          user: userA._id,
        },
      ]);

      const response =
        await userAAgent
          .get(
            "/api/requests?priority=HIGH"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(1);

      expect(
        response.body.data.requests[0].priority
      ).toBe("HIGH");
    });


    it("should search requests", async () => {
      await ServiceRequest.create([
        {
          title: "Printer problem",
          description:
            "The office printer is currently not working.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          user: userA._id,
        },
        {
          title: "Billing issue",
          description:
            "There is an incorrect charge on my account.",
          category: "BILLING",
          priority: "MEDIUM",
          user: userA._id,
        },
      ]);

      const response =
        await userAAgent
          .get(
            "/api/requests?search=printer"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(1);

      expect(
        response.body.data.requests[0].title
      ).toBe("Printer problem");
    });


    it("should return pagination metadata", async () => {
      const requests = [];

      for (let i = 1; i <= 15; i++) {
        requests.push({
          title: `Request ${i}`,
          description:
            `This is the description for service request number ${i}.`,
          category: "TECHNICAL",
          priority: "MEDIUM",
          user: userA._id,
        });
      }

      await ServiceRequest.insertMany(
        requests
      );

      const response =
        await userAAgent
          .get(
            "/api/requests?page=1&limit=10"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(10);

      expect(
        response.body.pagination.page
      ).toBe(1);

      expect(
        response.body.pagination.limit
      ).toBe(10);

      expect(
        response.body.pagination.totalItems
      ).toBe(15);

      expect(
        response.body.pagination.totalPages
      ).toBe(2);

      expect(
        response.body.pagination.hasNextPage
      ).toBe(true);

      expect(
        response.body.pagination.hasPreviousPage
      ).toBe(false);
    });


    it("should return the second pagination page", async () => {
      const requests = [];

      for (let i = 1; i <= 15; i++) {
        requests.push({
          title: `Request ${i}`,
          description:
            `This is the description for service request number ${i}.`,
          category: "TECHNICAL",
          priority: "MEDIUM",
          user: userA._id,
        });
      }

      await ServiceRequest.insertMany(
        requests
      );

      const response =
        await userAAgent
          .get(
            "/api/requests?page=2&limit=10"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.requests
      ).toHaveLength(5);

      expect(
        response.body.pagination.page
      ).toBe(2);

      expect(
        response.body.pagination.hasNextPage
      ).toBe(false);

      expect(
        response.body.pagination.hasPreviousPage
      ).toBe(true);
    });


    it("should reject invalid pagination values", async () => {
      const response =
        await userAAgent
          .get(
            "/api/requests?page=-1&limit=500"
          );

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe(
        "Validation failed"
      );
    });


    it("should reject invalid sort field", async () => {
      const response =
        await userAAgent
          .get(
            "/api/requests?sortBy=password"
          );

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/requests/:id", () => {
    it("should allow owner to view own request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "My request",
          description:
            "This request belongs to User A.",
          category: "ACCOUNT",
          priority: "MEDIUM",
          user: userA._id,
        });

      const response =
        await userAAgent.get(
          `/api/requests/${serviceRequest._id}`
        );

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(
        response.body.data.request.title
      ).toBe("My request");
    });


    it("should prevent one user from viewing another user's request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Private request",
          description:
            "This request belongs only to User A.",
          category: "ACCOUNT",
          priority: "MEDIUM",
          user: userA._id,
        });

      const response =
        await userBAgent.get(
          `/api/requests/${serviceRequest._id}`
        );

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
    });


    it("should allow ADMIN to view another user's request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "User request",
          description:
            "Admin should be able to view this request.",
          category: "ACCOUNT",
          priority: "MEDIUM",
          user: userA._id,
        });

      const response =
        await adminAgent.get(
          `/api/requests/${serviceRequest._id}`
        );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.request.title
      ).toBe("User request");
    });


    it("should return 404 for nonexistent request", async () => {
      const fakeId =
        "507f1f77bcf86cd799439011";

      const response =
        await userAAgent.get(
          `/api/requests/${fakeId}`
        );

      expect(response.statusCode).toBe(404);
    });


    it("should reject malformed MongoDB request ID", async () => {
      const response =
        await userAAgent.get(
          "/api/requests/not-a-valid-id"
        );

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe(
        "Validation failed"
      );
    });
  });
  describe("PATCH /api/requests/:id", () => {
    it("should allow owner to edit a PENDING request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Old title",
          description:
            "This is the original request description.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        });

      const response =
        await userAAgent
          .patch(
            `/api/requests/${serviceRequest._id}`
          )
          .send({
            title: "Updated title",
            priority: "HIGH",
          });

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.request.title
      ).toBe("Updated title");

      expect(
        response.body.data.request.priority
      ).toBe("HIGH");
    });


    it("should prevent another user from editing a request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "User A request",
          description:
            "User B must not edit this request.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        });

      const response =
        await userBAgent
          .patch(
            `/api/requests/${serviceRequest._id}`
          )
          .send({
            title: "Hacked title",
          });

      expect(response.statusCode).toBe(403);

      const unchanged =
        await ServiceRequest.findById(
          serviceRequest._id
        );

      expect(unchanged.title).toBe(
        "User A request"
      );
    });


    it("should reject editing an IN_PROGRESS request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Processing request",
          description:
            "This request is already being processed.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
          user: userA._id,
        });

      const response =
        await userAAgent
          .patch(
            `/api/requests/${serviceRequest._id}`
          )
          .send({
            title: "Changed title",
          });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe(
        "Only pending requests can be edited"
      );
    });


    it("should reject editing a RESOLVED request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Resolved request",
          description:
            "This request has already been resolved.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "RESOLVED",
          user: userA._id,
        });

      const response =
        await userAAgent
          .patch(
            `/api/requests/${serviceRequest._id}`
          )
          .send({
            title: "Changed title",
          });

      expect(response.statusCode).toBe(400);
    });


    it("should ignore attempts to change status through normal update endpoint", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Status security test",
          description:
            "Testing that users cannot update request status directly.",
          category: "TECHNICAL",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        });

      const response =
        await userAAgent
          .patch(
            `/api/requests/${serviceRequest._id}`
          )
          .send({
            title: "Valid title update",
            status: "RESOLVED",
          });

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.request.title
      ).toBe("Valid title update");

      expect(
        response.body.data.request.status
      ).toBe("PENDING");
    });


    it("should ignore attempts to change ownership through normal update endpoint", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Ownership security test",
          description:
            "Testing that ownership cannot be changed.",
          category: "ACCOUNT",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        });

      const response =
        await userAAgent
          .patch(
            `/api/requests/${serviceRequest._id}`
          )
          .send({
            title: "Updated safely",
            user: userB._id.toString(),
          });

      expect(response.statusCode).toBe(200);

      const updated =
        await ServiceRequest.findById(
          serviceRequest._id
        );

      expect(
        updated.user.toString()
      ).toBe(userA._id.toString());
    });
  });
  describe("PATCH /api/requests/:id/cancel", () => {
    it("should allow owner to cancel a PENDING request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Cancel pending request",
          description:
            "This pending request should be cancelled.",
          category: "OTHER",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        });

      const response =
        await userAAgent.patch(
          `/api/requests/${serviceRequest._id}/cancel`
        );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.request.status
      ).toBe("CANCELLED");
    });


    it("should allow owner to cancel an IN_PROGRESS request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Cancel active request",
          description:
            "This active request should be cancelled.",
          category: "OTHER",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
          user: userA._id,
        });

      const response =
        await userAAgent.patch(
          `/api/requests/${serviceRequest._id}/cancel`
        );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.request.status
      ).toBe("CANCELLED");
    });


    it("should prevent another user from cancelling a request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Private cancellation",
          description:
            "User B must not cancel this request.",
          category: "ACCOUNT",
          priority: "MEDIUM",
          status: "PENDING",
          user: userA._id,
        });

      const response =
        await userBAgent.patch(
          `/api/requests/${serviceRequest._id}/cancel`
        );

      expect(response.statusCode).toBe(403);

      const unchanged =
        await ServiceRequest.findById(
          serviceRequest._id
        );

      expect(unchanged.status).toBe(
        "PENDING"
      );
    });


    it("should reject cancellation of a RESOLVED request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Resolved request",
          description:
            "This request has already been resolved.",
          category: "OTHER",
          priority: "MEDIUM",
          status: "RESOLVED",
          user: userA._id,
        });

      const response =
        await userAAgent.patch(
          `/api/requests/${serviceRequest._id}/cancel`
        );

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });


    it("should reject cancelling an already CANCELLED request", async () => {
      const serviceRequest =
        await ServiceRequest.create({
          title: "Cancelled request",
          description:
            "This request has already been cancelled.",
          category: "OTHER",
          priority: "MEDIUM",
          status: "CANCELLED",
          user: userA._id,
        });

      const response =
        await userAAgent.patch(
          `/api/requests/${serviceRequest._id}/cancel`
        );

      expect(response.statusCode).toBe(400);
    });
  });
  describe(
    "PATCH /api/requests/:id/status",
    () => {
      it("should reject USER trying to change status through admin endpoint", async () => {
        const serviceRequest =
          await ServiceRequest.create({
            title: "Status authorization",
            description:
              "Testing admin-only status management.",
            category: "TECHNICAL",
            priority: "MEDIUM",
            status: "PENDING",
            user: userA._id,
          });

        const response =
          await userAAgent
            .patch(
              `/api/requests/${serviceRequest._id}/status`
            )
            .send({
              status: "IN_PROGRESS",
            });

        expect(response.statusCode).toBe(403);

        const unchanged =
          await ServiceRequest.findById(
            serviceRequest._id
          );

        expect(unchanged.status).toBe(
          "PENDING"
        );
      });
      const validTransitions = [
        ["PENDING", "IN_PROGRESS"],
        ["PENDING", "CANCELLED"],
        ["IN_PROGRESS", "RESOLVED"],
        ["IN_PROGRESS", "CANCELLED"],
      ];


      test.each(validTransitions)(
        "ADMIN should allow valid transition %s -> %s",
        async (
          fromStatus,
          toStatus
        ) => {
          const serviceRequest =
            await ServiceRequest.create({
              title:
                "Valid transition test",
              description:
                "Testing a valid request status transition.",
              category: "TECHNICAL",
              priority: "MEDIUM",
              status: fromStatus,
              user: userA._id,
            });

          const response =
            await adminAgent
              .patch(
                `/api/requests/${serviceRequest._id}/status`
              )
              .send({
                status: toStatus,
              });

          expect(
            response.statusCode
          ).toBe(200);

          expect(
            response.body.data.request
              .status
          ).toBe(toStatus);

          const updated =
            await ServiceRequest.findById(
              serviceRequest._id
            );

          expect(updated.status).toBe(
            toStatus
          );
        }
      );

      const invalidTransitions = [
        ["PENDING", "RESOLVED"],
        ["IN_PROGRESS", "PENDING"],
        ["RESOLVED", "PENDING"],
        ["RESOLVED", "IN_PROGRESS"],
        ["RESOLVED", "CANCELLED"],
        ["CANCELLED", "PENDING"],
        ["CANCELLED", "IN_PROGRESS"],
        ["CANCELLED", "RESOLVED"],
        ["PENDING", "PENDING"],
        ["IN_PROGRESS", "IN_PROGRESS"],
        ["RESOLVED", "RESOLVED"],
        ["CANCELLED", "CANCELLED"],
      ];


      test.each(invalidTransitions)(
        "ADMIN should reject invalid transition %s -> %s",
        async (
          fromStatus,
          toStatus
        ) => {
          const serviceRequest =
            await ServiceRequest.create({
              title:
                "Invalid transition test",
              description:
                "Testing an invalid request status transition.",
              category: "TECHNICAL",
              priority: "MEDIUM",
              status: fromStatus,
              user: userA._id,
            });

          const response =
            await adminAgent
              .patch(
                `/api/requests/${serviceRequest._id}/status`
              )
              .send({
                status: toStatus,
              });

          expect(
            response.statusCode
          ).toBe(400);

          expect(
            response.body.success
          ).toBe(false);

          const unchanged =
            await ServiceRequest.findById(
              serviceRequest._id
            );

          expect(
            unchanged.status
          ).toBe(fromStatus);
        }
      );


      it("should reject an invalid status value", async () => {
        const serviceRequest =
          await ServiceRequest.create({
            title: "Invalid status",
            description:
              "Testing invalid status validation.",
            category: "TECHNICAL",
            priority: "MEDIUM",
            status: "PENDING",
            user: userA._id,
          });

        const response =
          await adminAgent
            .patch(
              `/api/requests/${serviceRequest._id}/status`
            )
            .send({
              status: "UNKNOWN_STATUS",
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
          "Validation failed"
        );

        const unchanged =
          await ServiceRequest.findById(
            serviceRequest._id
          );

        expect(unchanged.status).toBe(
          "PENDING"
        );
      });
    }
  );
});