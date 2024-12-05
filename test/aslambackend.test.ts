
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import supertest from "supertest";
import { db } from "../util/db"; 
import { aslamRouter } from "../util/aslam_dcf_backend"; 
import { PgTransaction } from "drizzle-orm/pg-core";
import { usersTable } from "../schema/db";

describe("POST /coinflip", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", aslamRouter);
  });

  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  it("should return 403 if no token is provided", async () => {
    const response = await supertest(app).post("/coinflip").send({ choice: "heads" });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("No token found");
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(app)
      .post("/coinflip")
      .set("Authorization", "Bearer invalid_token")
      .send({ choice: "heads" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid token");
  });

  it("should return 404 if user is not found", async () => {
    const token = jwt.sign({ user: { id: 1000000 } }, process.env.JWT_SECRET!);

    const response = await supertest(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 400 if balance is insufficient", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

    await db.update(usersTable).set({balance: "0.00"})
  
    const response = await supertest(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Insufficient balance to play");
  });  

  it("should process a valid coin flip and update balance", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

    await db.update(usersTable).set({balance: "100.00"})

    const response = await supertest(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body).toHaveProperty("message");
  });

  it("should return 500 if DB transaction fails", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!);

    await db.update(usersTable).set({balance: "100.00"})
  
    // Stub db.transaction to simulate failure during the transaction
    const transactionStub = sinon.stub(db, "transaction").callsFake(async (callback) => {
      try {
        // Create a fake transaction object that mimics the behavior of a real transaction
        const fakeTransaction = {
          update: sinon.stub().throws(new Error("DB error")), // Simulate failure on update
          insert: sinon.stub().throws(new Error("DB error")), // Simulate failure on insert
        };
  
        // Call the callback with the fake transaction
        await callback(fakeTransaction as any);
      } catch (error) {
        throw new Error("DB error");
      }
    });
  
    // Make the request to the /coinflip endpoint
    const response = await supertest(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });
  
    
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to update balance and record game");
  
    // Verify that the transactionStub was called
    expect(transactionStub.calledOnce).toBe(true);
  
    // Restore the stub after the test to avoid side effects
    sinon.restore();
  });
});
