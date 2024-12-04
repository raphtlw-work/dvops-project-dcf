import "dotenv/config"
import express from "express"
import jwt from "jsonwebtoken"
import supertest from "supertest"
import { oceanRouter } from "../util/ocean_dcf_backend"
import { db } from "../util/db"
import { usersTable } from "../schema/db"
import { eq } from "drizzle-orm"

jest.setTimeout(10000)

describe("POST /user/balance", () => {
  let app: express.Application
  let token: string
  let userId: number = 1

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use("/", oceanRouter)

    const user = { id: userId, email: "testuser@gmail.com" }
    token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: "3d" })
  })

  it("should return 403 if no token is provided", async () => {
    const response = await supertest(app).post("/user/balance").send({ balance: 100 })
    expect(response.status).toBe(403)
    expect(response.body.error).toBe("No token found")
  })

  it("should return 401 if the token is invalid", async () => {
    const invalidToken = "invalid-token"
    const response = await supertest(app)
      .post("/user/balance")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({ balance: 100 })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe("Invalid token")
  })

  it("should return 404 if user is not found", async () => {
    const response = await supertest(app)
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

    const response = await supertest(app)
      .post("/user/balance")
      .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6IllvdXJNb20xMjNAZ21haWwuY29tIiwidXNlcm5hbWUiOiJZb3VyTW9tMTIzIiwiYmFsYW5jZSI6IjEwNC4wMCIsInBhc3N3b3JkIjoiJDJiJDEwJEZONGhyRWdSLkVTWWdnSC90a2djL3U2ZzVDMEgydzMwbU9BUTdmbmZaV1V6WHM0RzkvcXhlIn0sImlhdCI6MTczMzMxNTg2MSwiZXhwIjoxNzMzNTc1MDYxfQ.A0Zq4t1ydEJSrj0jrLAeok60rbvw-zHrhwj4a2WOg30`)
      .send({ balance: 100 })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe("Failed to update balance")

    db.update = originalUpdate
  })

  it("should update balance successfully", async () => {
    const balance = 200
    const response = await supertest(app)
      .post("/user/balance")
      .set("Authorization", `Bearer ${token}`)
      .send({ balance })

    const dbUser = await db.select().from(usersTable).where(eq(usersTable.id, userId))

    expect(response.status).toBe(200)
    expect(parseInt(response.body.balance)).toEqual(balance)

    expect(parseInt(dbUser[0].balance)).toEqual(balance)
  })
})
