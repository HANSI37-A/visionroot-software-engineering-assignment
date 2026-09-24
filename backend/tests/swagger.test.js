const request = require("supertest");

const app = require("../src/app");


describe("Swagger Documentation", () => {
  it(
    "should serve Swagger UI",
    async () => {
      const response =
        await request(app)
          .get("/api-docs/");

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.text
      ).toContain(
        "Swagger UI"
      );
    }
  );


  it(
    "should expose OpenAPI JSON",
    async () => {
      const response =
        await request(app)
          .get("/api-docs.json");

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.openapi
      ).toBe("3.0.3");

      expect(
        response.body.info.title
      ).toBe(
        "Service Request Management API"
      );
    }
  );
});