import { z } from "zod";

export const createBenefitSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(28, { message: "Description is required " }),
  description: z
    .string()
    .min(5, { message: "Description is required" })
    .max(150, { message: "Description is required " }),
  status: z.enum(["available", "unavailable"], {
    required_error: "You need to set a status",
  }),
  type: z.enum(["food", "shelter", "resources", "medical"], {
    required_error: "You need to select a type",
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateBenefitDTO = z.infer<typeof createBenefitSchema>;
