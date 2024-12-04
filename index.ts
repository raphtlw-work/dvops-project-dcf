import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import express from "express"
import jwt from "jsonwebtoken"
import { usersTable } from "./schema/db.ts"
import { authLoginInput, authRegisterInput } from "./schema/routes.ts"
import { aslamRouter } from "./util/aslam_dcf_backend.ts"
import { chenxinRouter } from "./util/chenxin_dcf_backend.ts"
import { db } from "./util/db.ts"
import { oceanRouter } from "./util/ocean_dcf_backend.ts"
import { gameRouter } from "./util/raphael_dcf_backend.ts"

const app = express()

app.use(express.static("public"))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello, World")
})

if (process.env.NODE_ENV === "development") {
  let toReload = true
  app.get("/livereload", (req, res) => {
    res.json({ reload: toReload })
    toReload = false
  })
}

export const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
  try {
    const user = authRegisterInput.parse(req.body)
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await db.insert(usersTable).values({
      email: user.email,
      username: user.username,
      password: hashedPassword,
    })
    res.status(200).json({ success: true })
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    })
  }
})

authRouter.post("/login", async (req, res) => {
  try {
    const input = authLoginInput.parse(req.body)
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
    if (users.length === 0) throw new Error("Email not found in database")

    const user = users[0]
    const passwordMatch = await bcrypt.compare(input.password, user.password)
    if (!passwordMatch) throw new Error("Password authentication failed")
    const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    })
    res.status(200).json({ success: true, token })
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    })
  }
})

app.use("/auth", authRouter)
app.use("/game", gameRouter)

app.get("/user/balance", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(403).json({ error: "No token found" })
    return
  }

  const token = req.headers.authorization.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = payload.user as typeof usersTable.$inferSelect
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user.id))

    console.log(user)
    console.log(dbUser)

    if (dbUser.length === 0) {
      res.status(404).json({ error: "User not found" })
      return
    }

    const currentBalance = parseFloat(dbUser[0].balance)
    res.status(200).json({ success: true, balance: currentBalance })
  } catch (e) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.use(aslamRouter)
app.use(oceanRouter)
app.use(chenxinRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
