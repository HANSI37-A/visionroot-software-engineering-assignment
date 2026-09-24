const request = require("supertest");

const app = require("../src/app");

const User = require("../src/models/User");

const ServiceRequest = require("../src/models/ServiceRequest");


describe("Admin User Management API", () => {
  let userAgent;
  let adminAgent;
  let user;
  let admin;

  beforeEach(async () => {
    await ServiceRequest.deleteMany({});
    await User.deleteMany({});
    userAgent = request.agent(app);

    const userResponse =
      await userAgent
        .post("/api/auth/register")
        .send({
          name: "Normal User",
          email: "user@example.com",
          password: "Password123",
        });

    expect( userResponse.statusCode ).toBe(201);
    user = await User.findOne({
      email: "user@example.com",
    });

    expect(user).not.toBeNull();

    adminAgent = request.agent(app);

    const adminResponse =
      await adminAgent
        .post("/api/auth/register")
        .send({
          name: "Admin User",
          email: "admin@example.com",
          password: "Password123",
        });

    expect( adminResponse.statusCode).toBe(201);
    admin = await User.findOne({
      email: "admin@example.com",
    });

    expect(admin).not.toBeNull();
    admin.role = "ADMIN";
    await admin.save();
  });

  describe("Authorization", () => {
    it("should reject unauthenticated access to user list", async () => {
      const response =
        await request(app)
          .get("/api/users");

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe( false);
    });

    it("should reject USER access to user list", async () => {
      const response =
        await userAgent .get("/api/users");

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe( false);
    });


    it("should reject USER trying to update another user", async () => {
      const response = await userAgent
          .patch(
            `/api/users/${admin._id}`
          )
          .send({
            isActive: false,
          });

      expect(response.statusCode).toBe(403);
    });
  });

  describe("GET /api/users", () => {
    it("should allow ADMIN to list users", async () => {
      const response =
        await adminAgent
          .get("/api/users");

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe( true);
      expect( Array.isArray(response.body.data.users  ) ).toBe(true);
      expect(response.body.data.users).toHaveLength(2);
      expect( response.body.pagination.totalItems ).toBe(2);
    });


    it("should not expose password hashes", async () => {
      const response =
        await adminAgent
          .get("/api/users");

      expect(response.statusCode).toBe(200);

      response.body.data.users.forEach(
        (listedUser) => {
          expect(
            listedUser.password
          ).toBeUndefined();
        }
      );
    });


    it("should search users by name", async () => {
      const response =
        await adminAgent
          .get("/api/users?search=Normal");

      expect(response.statusCode).toBe(200);

      expect( response.body.data.users ).toHaveLength(1);

      expect( response.body.data.users[0].email).toBe("user@example.com");
    });


    it("should search users by email", async () => {
      const response =
        await adminAgent
          .get(
            "/api/users?search=user@example.com"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.users
      ).toHaveLength(1);

      expect(
        response.body.data.users[0].email
      ).toBe("user@example.com");
    });


    it("should filter users by role", async () => {
      const response =
        await adminAgent
          .get(
            "/api/users?role=ADMIN"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.users
      ).toHaveLength(1);

      expect(
        response.body.data.users[0].role
      ).toBe("ADMIN");
    });


    it("should filter active users", async () => {
      user.isActive = false;

      await user.save();


      const response =
        await adminAgent
          .get(
            "/api/users?isActive=true"
          );

      expect(response.statusCode).toBe(200);

      response.body.data.users.forEach(
        (listedUser) => {
          expect(
            listedUser.isActive
          ).toBe(true);
        }
      );
    });


    it("should filter inactive users", async () => {
      user.isActive = false;

      await user.save();


      const response =
        await adminAgent
          .get(
            "/api/users?isActive=false"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.users
      ).toHaveLength(1);

      expect(
        response.body.data.users[0].email
      ).toBe("user@example.com");

      expect(
        response.body.data.users[0].isActive
      ).toBe(false);
    });


    it("should return pagination metadata", async () => {
      const response =
        await adminAgent
          .get(
            "/api/users?page=1&limit=1"
          );

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.users
      ).toHaveLength(1);

      expect(
        response.body.pagination.page
      ).toBe(1);

      expect(
        response.body.pagination.limit
      ).toBe(1);

      expect(
        response.body.pagination.totalItems
      ).toBe(2);

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
  });

  describe(
    "PATCH /api/users/:id",
    () => {
      it("should allow ADMIN to deactivate a user", async () => {
        const response =
          await adminAgent
            .patch(
              `/api/users/${user._id}`
            )
            .send({
              isActive: false,
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(
          true
        );

        expect(
          response.body.data.user.isActive
        ).toBe(false);


        const updatedUser =
          await User.findById(user._id);

        expect(
          updatedUser.isActive
        ).toBe(false);
      });


      it("should allow ADMIN to reactivate a user", async () => {
        user.isActive = false;

        await user.save();


        const response =
          await adminAgent
            .patch(
              `/api/users/${user._id}`
            )
            .send({
              isActive: true,
            });

        expect(response.statusCode).toBe(200);

        expect(
          response.body.data.user.isActive
        ).toBe(true);


        const updatedUser =
          await User.findById(user._id);

        expect(
          updatedUser.isActive
        ).toBe(true);
      });


      it("should prevent ADMIN from deactivating own account", async () => {
        const response =
          await adminAgent
            .patch(
              `/api/users/${admin._id}`
            )
            .send({
              isActive: false,
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(
          false
        );

        expect(response.body.message).toBe(
          "You cannot deactivate your own account"
        );


        const unchangedAdmin =
          await User.findById(admin._id);

        expect(
          unchangedAdmin.isActive
        ).toBe(true);
      });


      it("should return 404 for nonexistent user", async () => {
        const fakeId =
          "507f1f77bcf86cd799439011";

        const response =
          await adminAgent
            .patch(
              `/api/users/${fakeId}`
            )
            .send({
              isActive: false,
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(
          false
        );
      });


      it("should reject malformed user ID", async () => {
        const response =
          await adminAgent
            .patch(
              "/api/users/not-a-valid-id"
            )
            .send({
              isActive: false,
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
          "Validation failed"
        );
      });


      it("should reject missing isActive field", async () => {
        const response =
          await adminAgent
            .patch(
              `/api/users/${user._id}`
            )
            .send({});

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
          "Validation failed"
        );
      });


      it("should reject invalid isActive value", async () => {
        const response =
          await adminAgent
            .patch(
              `/api/users/${user._id}`
            )
            .send({
              isActive: "invalid",
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
          "Validation failed"
        );
      });


      it("should preserve user's service requests after deactivation", async () => {
        const serviceRequest =
          await ServiceRequest.create({
            title: "Existing request",
            description:
              "This request must remain after user deactivation.",
            category: "TECHNICAL",
            priority: "MEDIUM",
            status: "PENDING",
            user: user._id,
          });


        const response =
          await adminAgent
            .patch(
              `/api/users/${user._id}`
            )
            .send({
              isActive: false,
            });

        expect(response.statusCode).toBe(200);


        const existingRequest =
          await ServiceRequest.findById(
            serviceRequest._id
          );

        expect(
          existingRequest
        ).not.toBeNull();

        expect(
          existingRequest.user.toString()
        ).toBe(user._id.toString());
      });


      it("should block deactivated user from protected routes", async () => {
        const deactivateResponse =
          await adminAgent
            .patch(
              `/api/users/${user._id}`
            )
            .send({
              isActive: false,
            });

        expect(
          deactivateResponse.statusCode
        ).toBe(200);
        const response =
          await userAgent
            .get("/api/requests");

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(
          false
        );

        expect(response.body.message).toBe(
          "Your account is inactive"
        );
      });
    }
  );
});