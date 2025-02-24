import { z } from "zod";

export const CreateUserSchema = z.object({
     email: z.string().email(),
     password: z.string().min(4),
     phone: z.string().min(10),
     name: z.string(),
     type: z.string()
});