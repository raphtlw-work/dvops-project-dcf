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

    beforeAll(() => {
      app = express();
      app.use(express.json()); // Middleware to parse JSON bodies
      app.use("/", chenxinRouter); 
    });

    afterEach(() => {
      sinon.restore(); // Restore stubs after each test
    });

    // Tests for GET /user/profile
    it("should return 403 if no token is provided", async () => {
      const response = await supertest(app).get("/user/profile");

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("No token found");
    });

    it("should return 404 if user is not found", async () => {
      const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([]), // Simulate no user found
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const response = await supertest(app)
        .get("/user/profile")
        .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6InNuYWNrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25hY2siLCJiYWxhbmNlIjoiMC4wMCIsInBhc3N3b3JkIjoiJDJiJDEwJDFOMzQxdVFabW83UWdBd3BRWlJGOS4xT2drSmU0ZVpGcWUxU0w4OVZ2cU5BMlVUd1FhUElLIn0sImlhdCI6MTczMzMzNTg2MywiZXhwIjoxNzMzNTk1MDYzfQ.rvSOnO_7rwHg0FC3uQ1opwoqB4mKsFfUoI1_M0jEZqE`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });

    it("should return 200 with user profile if user is found", async () => {
      const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([{ id: 1, username: "testuser", email: "test@example.com" }]), // Simulate user found
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const response = await supertest(app)
        .get("/user/profile")
        .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6InNuYWNrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25hY2siLCJiYWxhbmNlIjoiMC4wMCIsInBhc3N3b3JkIjoiJDJiJDEwJDFOMzQxdVFabW83UWdBd3BRWlJGOS4xT2drSmU0ZVpGcWUxU0w4OVZ2cU5BMlVUd1FhUElLIn0sImlhdCI6MTczMzMzNTg2MywiZXhwIjoxNzMzNTk1MDYzfQ.rvSOnO_7rwHg0FC3uQ1opwoqB4mKsFfUoI1_M0jEZqE`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe("testuser");
      expect(response.body.email).toBe("test@example.com");
    });

    // Tests for PUT /user/profile
    it("should return 403 if no token is provided", async () => {
      const response = await supertest(app)
        .put("/user/profile")
        .send({ username: "newuser", email: "new@example.com" });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("No token found");
    });

    it("should return 404 if user is not found", async () => {
      const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([]), // Simulate no user found
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const response = await supertest(app)
        .put("/user/profile")
        .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6InNuYWNrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25hY2siLCJiYWxhbmNlIjoiMC4wMCIsInBhc3N3b3JkIjoiJDJiJDEwJDFOMzQxdVFabW83UWdBd3BRWlJGOS4xT2drSmU0ZVpGcWUxU0w4OVZ2cU5BMlVUd1FhUElLIn0sImlhdCI6MTczMzMzNTg2MywiZXhwIjoxNzMzNTk1MDYzfQ.rvSOnO_7rwHg0FC3uQ1opwoqB4mKsFfUoI1_M0jEZqE`)
        .send({ username: "newuser", email: "new@example.com" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });

    it("should return 200 and update user profile if user is found", async () => {
      const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

      sinon.stub(db, "select").returns({
        from: sinon.stub().returns({
          where: sinon.stub().resolves([{ id: 1, username: "olduser", email: "old@example.com" }]), // Simulate user found
        }),
      } as unknown as PgSelectBuilder<any, "db">);

      const setStub = sinon.stub().returns({
        where: sinon.stub().resolves(), // Simulate successful update
      });

      sinon.stub(db, "update").returns({
        set: setStub,
      } as unknown as PgUpdateBuilder<any, any>);

      const response = await supertest(app)
        .put("/user/profile")
        .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6InNuYWNrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25hY2siLCJiYWxhbmNlIjoiMC4wMCIsInBhc3N3b3JkIjoiJDJiJDEwJDFOMzQxdVFabW83UWdBd3BRWlJGOS4xT2drSmU0ZVpGcWUxU0w4OVZ2cU5BMlVUd1FhUElLIn0sImlhdCI6MTczMzMzNTg2MywiZXhwIjoxNzMzNTk1MDYzfQ.rvSOnO_7rwHg0FC3uQ1opwoqB4mKsFfUoI1_M0jEZqE`)
        .send({ username: "newuser", email: "new@example.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe("newuser");
      expect(response.body.email).toBe("new@example.com");
    });
  });
