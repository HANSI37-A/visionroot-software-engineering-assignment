const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
  };

  test("register", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("validation failure", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "",
      email: "invalid-email",
      password: "123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("duplicate email", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test("login success", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("wrong password", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });

  test("nonexistent account", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "Password123!",
    });
    expect(res.statusCode).toBe(401);
  });

  test("/me without authentication → 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });

  test("/me with authentication → 200", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const cookie = loginRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("prevents mass-assignment of role during registration", async () => {
    const payloadWithAdmin = {
      name: "Attacker User",
      email: "attacker@example.com",
      password: "Password123!",
      role: "ADMIN",     
      isActive: false,   
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(payloadWithAdmin);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.role).toBe("USER");
    expect(res.body.data.user.isActive).toBe(true);

    const dbUser = await User.findOne({ email: "attacker@example.com" });
    expect(dbUser).not.toBeNull();
    expect(dbUser.role).toBe("USER");
    expect(dbUser.isActive).toBe(true);
  });

  test("prevents non-admin user from bypassing role check via request body", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const cookie = loginRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/admin/test")
      .set("Cookie", cookie)
      .send({ role: "ADMIN" });

    expect(res.statusCode).toBe(403);
  });
});