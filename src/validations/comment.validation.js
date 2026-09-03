import { z } from "zod";

export const createCommentSchema = z.object({
  text: z.string().min(1, "Write something before you post.").max(500, "Keep comments under 500 characters."),
});

export const updateCommentSchema = createCommentSchema;
