import "dotenv/config"

import { PgSelectBuilder, PgUpdateBuilder } from "drizzle-orm/pg-core"
import express from "express"
import jwt from "jsonwebtoken"
import sinon from "sinon"
import supertest from "supertest"
import { db } from "../util/db"
import { gameRouter } from "../util/raphael_dcf_backend"

describe("POST /flip", () => {
  let app: express.Application

  beforeAll(() => {
    app = express()
    app.use(express.json()) // Middleware to parse JSON bodies
    app.use("/", gameRouter) // Use your router in a test server
  })

  afterEach(() => {
    sinon.restore() // Restore stubs after each test
  })

  it("should return 403 if no token is provided", async () => {
    const response = await supertest(app).post("/flip").send({ amount: 50 })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe("No token found")
  })

  it("should return 404 if user is not found", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!)

    sinon.stub(db, "select").returns({
      from: sinon.stub().returns({
        where: sinon.stub().resolves([]), // Simulate no user found
      }),
    } as unknown as PgSelectBuilder<any, "db">)

    const response = await supertest(app)
      .post("/flip")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 50 })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe("User not found")
  })

  it("should return 400 for invalid amount", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!)

    sinon.stub(db, "select").returns({
      from: sinon.stub().returns({
        where: sinon.stub().resolves([{ id: 1, balance: "100" }]),
      }),
    } as unknown as PgSelectBuilder<any, "db">)

    const response = await supertest(app)
      .post("/flip")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: -10 })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Amount must be between 0 and 100 credits")
  })

  it("should process a valid flip and update balance", async () => {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!)

    // Mock `db.select()` to return a user with a balance
    sinon.stub(db, "select").returns({
      from: sinon.stub().returns({
        where: sinon.stub().resolves([{ id: 1, balance: "100" }]),
      }),
    } as unknown as PgSelectBuilder<any, "db">)

    // Mock `db.update()` to simulate a successful update
    const setStub = sinon.stub().returns({
      where: sinon.stub().resolves(), // Simulate successful update
    })

    sinon.stub(db, "update").returns({
      set: setStub,
    } as unknown as PgUpdateBuilder<any, any>)

    const response = await supertest(app)
      .post("/flip")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 50 })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("result")
    expect(response.body).toHaveProperty("newBalance")
  })
})
