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
    // Sign up a test user first
    const signupResponse = await supertest(app)
      .post("/user/signup")
      .send({
        email: "test@example.com",
        password: "password123",
        username: "testuser"
      });

    expect(signupResponse.status).toBe(200);
    const authToken = signupResponse.body.token;

    // Mock database error
    const originalUpdate = db.update;
    db.update = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    // Test balance update with new token
    const response = await supertest(app)
      .post("/user/balance")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ balance: 100 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to update balance");

    // Restore original db.update
    db.update = originalUpdate;

    // Clean up test user
    await db.delete(usersTable).where(eq(usersTable.email, "test@example.com"));
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
