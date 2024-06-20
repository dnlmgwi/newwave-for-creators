import { z } from "zod";
import { profileSchema } from "../validators/Profile";
import type { userSchema } from "../validators/Profile/profileValidator";

export type UserDTO = z.infer<typeof userSchema>;

export type ProfilSchema = typeof profileSchema;
