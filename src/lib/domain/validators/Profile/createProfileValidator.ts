import { z } from "zod";

export const createProfileSchema = z.object({
  id: z.string().min(1, { message: "Invalid ID format" }), // Assuming id is a UUID
  userId: z.string().min(1, { message: "Invalid User ID format" }), // Assuming userId is a UUID
  name: z.string().min(1, { message: "Name is required" }),
  createdAt: z.string().datetime({ message: "Invalid date-time format" }),
});
// satisfies Profile;
