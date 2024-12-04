require("dotenv/config");
const express = require("express");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { db } = require("../util/db"); // Adjust this path as per your setup
const { aslamRouter } = require("../util/aslam_dcf_backend"); // Update path to your router
const { usersTable } = require("../schema/db");

const { expect } = chai;

// Use chai-http plugin
chai.use(chaiHttp);

describe("POST /coinflip", () => {
  let app;

  before(() => {
    app = express();
    app.use(express.json());
    app.use("/", aslamRouter);
  });

  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  it("should return 403 if no token is provided", async () => {
    const res = await chai.request(app).post("/coinflip").send({ choice: "heads" });

    expect(res).to.have.status(403);
    expect(res.body).to.have.property("error", "No token found");
  });

  it("should return 401 if token is invalid", async () => {
    const res = await chai
      .request(app)
      .post("/coinflip")
      .set("Authorization", "Bearer invalid_token")
      .send({ choice: "heads" });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property("error", "Invalid token");
  });

  it("should return 404 if user is not found", async () => {
    const token = jwt.sign({ user: { id: 1000000 } }, process.env.JWT_SECRET);

    const res = await chai
      .request(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error", "User not found");
  });

  it("should return 400 if balance is insufficient", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET);

    await db.update(usersTable).set({ balance: "0.00" });

    const res = await chai
      .request(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error", "Insufficient balance to play");
  });

  it("should process a valid coin flip and update balance", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET);

    await db.update(usersTable).set({ balance: "100.00" });

    const res = await chai
      .request(app)
      .post("/coinflip")
      .set("Authorization", `Bearer ${token}`)
      .send({ choice: "heads" });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("balance");
    expect(res.body).to.have.property("message");
  });

  
});
