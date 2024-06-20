import { z } from "zod";
import { createBenefitSchema } from "../validators/Benefit";

export type InsertBenefitDTO = z.infer<typeof createBenefitSchema>;
