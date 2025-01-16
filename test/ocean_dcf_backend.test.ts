import "dotenv/config"
import express from "express"
import jwt from "jsonwebtoken"
import supertest from "supertest"
import { oceanRouter } from "../util/ocean_dcf_backend"
import { db } from "../util/db"
import { usersTable } from "../schema/db"
import { eq } from "drizzle-orm"
import {authRouter} from '../index'
import { gameRouter } from "../util/raphael_dcf_backend"
import { aslamRouter } from "../util/aslam_dcf_backend"
import { chenxinRouter } from "../util/chenxin_dcf_backend"

jest.setTimeout(10000)

describe("POST /user/balance", () => {
  let token: string
  let userId: number = 1
  const dummyUser = { email: `dummyuser@gmail.com`, password: "dummyPassword", username: "dummy" }

  beforeEach(async () => {
    // Create a dummy account
    const registerResponse = await supertest("http://localhost:3000").post('/auth/register').send(dummyUser)

    console.log(registerResponse.body)

    // Login to get the access token
    const loginResponse = await supertest("http://localhost:3000")
      .post("/auth/login")
      .send({ email: dummyUser.email, password: dummyUser.password })

    console.log(loginResponse.body)

    token = loginResponse.body.token
  })

  afterEach(async () => {
    await db.delete(usersTable).where(eq(usersTable.email, dummyUser.email))
  })

  it("should return 403 if no token is provided", async () => {
    const response = await supertest("http://localhost:3000").post("/user/balance").send({ balance: 100 })
    expect(response.status).toBe(403)
    expect(response.body.error).toBe("No token found")
  })

  it("should return 401 if the token is invalid", async () => {
    const invalidToken = "invalid-token"
    const response = await supertest("http://localhost:3000")
      .post("/user/balance")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({ balance: 100 })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe("Invalid token")
  })

  it("should return 404 if user is not found", async () => {
    const user = { id: userId, email: "testuser@gmail.com" }
    token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: "3d" })

    const response = await supertest("http://localhost:3000")
      .post("/user/balance")
      .set("Authorization", `Bearer ${token}`)
      .send({ balance: 100 })

    const dbUser = await db.select().from(usersTable).where(eq(usersTable.id, userId))

    if (dbUser.length === 0) {
      expect(response.status).toBe(404)
      expect(response.body.error).toBe("User not found")
    }
  })

  it("should return 500 if updating balance fails", async () => {
    const originalUpdate = db.update
    db.update = jest.fn().mockImplementation(() => {
      throw new Error("Database error")
    })

    const app = express()
    app.use(express.json())
    app.use(oceanRouter)
    const response = await supertest(app)
      .post("/user/balance")
      .set("Authorization", `Bearer ${token}`)
      .send({ balance: 100 })

    await db.delete(usersTable).where(eq(usersTable.email, dummyUser.email))

    expect(response.status).toBe(500)
    expect(response.body.error).toBe("Failed to update balance")

    db.update = originalUpdate
  })

  it("should update balance successfully", async () => {
    // Create a dummy account
    const dummyUser = { email: `dummyuser@gmail.com`, password: "dummyPassword", username: "dummy" }
    const registerResponse = await supertest("http://localhost:3000").post('/auth/register').send(dummyUser)

    console.log(registerResponse.body)

    // Login to get the access token
    const loginResponse = await supertest("http://localhost:3000")
      .post("/auth/login")
      .send({ email: dummyUser.email, password: dummyUser.password })

    console.log(loginResponse.body)

    token = loginResponse.body.token

    const balance = 200
    const response = await supertest("http://localhost:3000")
      .post("/user/balance")
      .set("Authorization", `Bearer ${token}`)
      .send({ balance })

    console.log(response.body)

    const dbUser = await db.select().from(usersTable).where(eq(usersTable.email, dummyUser.email))

    expect(response.status).toBe(200)
    expect(parseInt(response.body.balance)).toEqual(balance)

    expect(parseInt(dbUser[0].balance)).toEqual(balance)
  })
})
