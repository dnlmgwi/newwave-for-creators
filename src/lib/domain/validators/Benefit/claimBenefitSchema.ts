import { z } from "zod";

export const claimBenefitSchema = z.object({
  id: z
    .string()
    .min(1, { message: "Benefit ID is required" })
    .max(28, { message: "Benefit ID is required" }),
  beneficiary: z
    .string()
    .min(5, { message: "Beneficiary ID is required" })
    .max(150, { message: "Beneficiary ID is required" }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type ClaimBenefitDTO = z.infer<typeof claimBenefitSchema>;
