"use server";

import prisma from "@/lib/prisma";

type CreatePostParams = {
  content: string;
  userId: string;
};

export const createPost = async ({ content, userId }: CreatePostParams) => {
  try {
    await prisma.post.create({
      data: {
        content,
        userId,
      },
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    throw new Error("Failed to create post");
  }
};
