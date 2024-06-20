import { z } from "zod";
import { findProfileSchema } from "../validators/Profile/findProfileValidator";

export type FindProfileDTO = z.infer<typeof findProfileSchema>;
