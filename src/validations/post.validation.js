import { z } from "zod";

const bodySchema = z.string().max(2000, "Keep posts under 2000 characters.");

export const createPostSchema = z
  .object({
    body: bodySchema,
    image: z.any().nullable(),
  })
  .refine((data) => data.body.trim().length > 0 || data.image, {
    message: "Add some words or a photo before you post.",
    path: ["body"],
  });

export const updatePostSchema = createPostSchema;
