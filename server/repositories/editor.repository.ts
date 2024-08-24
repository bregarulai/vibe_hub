"use server";

import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/type";

type CreatePostParams = {
  content: string;
  userId: string;
};

export const createPost = async ({ content, userId }: CreatePostParams) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
      },
      include: postDataInclude,
    });

    return newPost;
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    throw new Error("Failed to create post");
  }
};
