import { z } from "zod";

export const findProfileSchema = z.object({
  id: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});
// satisfies Profile;
