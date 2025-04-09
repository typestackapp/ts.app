import { z } from "zod"

export const allowed_actions = ["login", "register", "grant"] as const
export const allowed_grants = ["refresh_token", "password", "authorization_code", "session"] as const

export const z_app_filters = z.object({
    actions: z.array(z.enum(allowed_actions)).optional()
})

export const z_authorize_input = z.object({
    client_id: z.string()
})

