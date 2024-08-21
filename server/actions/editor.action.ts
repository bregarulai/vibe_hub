"use server";

import { z } from "zod";

import { createPostSchema } from "@/lib/validation";
import { validateRequest } from "@/lucia/auth";
import { createPost } from "@/server/repositories/editor.repository";

export const createPostAction = async (input: string) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  try {
    await createPost({ content, userId: user.id });
  } catch (error) {
    console.error(`Error submitting post: ${error}`);
    throw new Error("Failed to submit post");
  }
};
