"use server";

import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/type";

type CreatePostParams = {
  content: string;
  userId: string;
  mediaIds: string[];
};

export const createPost = async ({
  content,
  userId,
  mediaIds,
}: CreatePostParams) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        userId,
        attachments: {
          connect: mediaIds.map((mediaId) => ({ id: mediaId })),
        },
      },
      include: getPostDataInclude(userId),
    });

    return newPost;
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    throw new Error("Failed to create post");
  }
};
