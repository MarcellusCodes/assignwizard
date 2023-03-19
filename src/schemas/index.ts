import { z } from "zod";

export const addAssignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  deadline: z.string(),
  protected: z.boolean(),
  password: z.string(),
});

export const deleteAssignmentSchema = z.object({
  id: z.string().min(1),
});
