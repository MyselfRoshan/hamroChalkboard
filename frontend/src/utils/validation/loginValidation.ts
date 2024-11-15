import { z } from "zod"
export type LoginFormValues = {
    email_or_username: string
    password: string
}
export const loginValidation = z.object({
    email_or_username: z
        .string()
        .min(1, "Email or Username is required")
        .min(3, "Email or username must be at least 3 characters long"),
    password: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters long"),
})
