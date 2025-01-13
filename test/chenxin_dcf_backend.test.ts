import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import supertest from "supertest";
import { db } from "../util/db";
import { chenxinRouter } from "../util/chenxin_dcf_backend";
import { PgSelectBuilder, PgUpdateBuilder } from "drizzle-orm/pg-core";

describe("User Profile Endpoints", () => {
  let app: express.Application;
  const JWT_SECRET = "test-secret"; // Use a consistent test secret

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", chenxinRouter);
    // Mock process.env.JWT_SECRET
    process.env.JWT_SECRET = JWT_SECRET;
  });

  afterEach(() => {
    sinon.restore();
  });

  // Helper function to generate valid test tokens
  const generateTestToken = (userId: number) => {
    return jwt.sign(
      { 
        user: { 
          id: userId,
          email: "test@example.com",
          username: "testuser",
          balance: "0.00"
        } 
      }, 
      JWT_SECRET
    );
  };

  describe("GET /user/profile", () => {
    it("should return 403 if no token is provided", async () => {
      const response = await supertest(app).get("/user/profile");
      expect(response.status).toBe(403);
      expect(response.body.error).toBe("No token found");
    });

    it("should return 404 if user is not found", async () => {
      const token = generateTestToken(1);

      // Mock the database query
      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([]),
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const response = await supertest(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });

    it("should return 200 with user profile if user is found", async () => {
      const token = generateTestToken(1);
      const mockUser = { id: 1, username: "testuser", email: "test@example.com" };

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([mockUser]),
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const response = await supertest(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe(mockUser.username);
      expect(response.body.email).toBe(mockUser.email);
    });
  });

  describe("PUT /user/profile", () => {
    it("should return 403 if no token is provided", async () => {
      const response = await supertest(app)
        .put("/user/profile")
        .send({ username: "newuser", email: "new@example.com" });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("No token found");
    });

    it("should return 404 if user is not found", async () => {
      const token = generateTestToken(1);

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([]),
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const response = await supertest(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "newuser", email: "new@example.com" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });

    it("should return 200 and update user profile if user is found", async () => {
      const token = generateTestToken(1);
      const mockUser = { id: 1, username: "olduser", email: "old@example.com" };

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([mockUser]),
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const setStub = sinon.stub().returns({
        where: sinon.stub().resolves(),
      });

      sinon.stub(db, "update").returns({
        set: setStub,
      } as unknown as PgUpdateBuilder<any, any>);

      const response = await supertest(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "newuser", email: "new@example.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe("newuser");
      expect(response.body.email).toBe("new@example.com");
    });
  });
});