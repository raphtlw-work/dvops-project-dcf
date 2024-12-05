import "dotenv/config"

import { expect } from "chai"
import { PgSelectBuilder, PgUpdateBuilder } from "drizzle-orm/pg-core"
import express, { Application } from "express"
import jwt from "jsonwebtoken"
import sinon from "sinon"
import supertest from "supertest"
import { usersTable } from "../schema/db.js"
import { db } from "../util/db.js"
import { gameRouter } from "../util/raphael_dcf_backend.js"

describe("POST /flip", function () {
  let app: Application

  before(async () => {
    await db.delete(usersTable)

    app = express()
    app.use(express.json())
    app.use("/", gameRouter)
  })

  afterEach(() => {
    sinon.restore()
  })

  it("should return 403 if no token is provided", async function () {
    const response = await supertest(app).post("/flip").send({ amount: 50 })

    expect(response.status).to.equal(403)
    expect(response.body.error).to.equal("No token found")
  })

  it("should return 404 if user is not found", async function () {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!)

    sinon.stub(db, "select").returns({
      from: sinon.stub().returns({
        where: sinon.stub().resolves([]),
      }),
    } as unknown as PgSelectBuilder<any, "db">)

    const response = await supertest(app)
      .post("/flip")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 50 })

    expect(response.status).to.equal(404)
    expect(response.body.error).to.equal("User not found")
  })

  it("should return 400 for invalid amount", async function () {
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

    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal(
      "Amount must be between 0 and 100 credits",
    )
  })

  it("should process a valid flip and update balance", async function () {
    const token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET!)

    // Mock `db.select()` to return a user with a balance
    sinon.stub(db, "select").returns({
      from: sinon.stub().returns({
        where: sinon.stub().resolves([{ id: 1, balance: "100" }]),
      }),
    } as unknown as PgSelectBuilder<any, "db">)

    // Mock `db.update()` to simulate a successful update
    const setStub = sinon.stub().returns({
      where: sinon.stub().resolves(),
    })

    sinon.stub(db, "update").returns({
      set: setStub,
    } as unknown as PgUpdateBuilder<any, any>)

    const response = await supertest(app)
      .post("/flip")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 50 })

    expect(response.status).to.equal(200)
    expect(response.body).to.have.property("result")
    expect(response.body).to.have.property("newBalance")
  })
})
