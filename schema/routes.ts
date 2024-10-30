import { z } from "zod"

export const responseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
})

export type Response = z.infer<typeof responseSchema>

export const errorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
})

export type Error = z.infer<typeof errorSchema>

export const authRegisterInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const authLoginInput = z.object({
  email: z.string().email(),
  password: z.string(),
})
