import prisma from "@/lib/prisma";
import { Delete } from "lucide-react";

type CreateLikeParams = {
  userId: string;
  postId: string;
};

export const createLike = async ({ userId, postId }: CreateLikeParams) => {
  try {
    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      create: {
        userId,
        postId,
      },
      update: {},
    });
  } catch (error) {
    console.error(`Error creating like: ${error}`);
  }
};

type DeleteLikeParams = {
  userId: string;
  postId: string;
};

export const deleteLike = async ({ userId, postId }: DeleteLikeParams) => {
  try {
    await prisma.like.deleteMany({
      where: {
        userId,
        postId,
      },
    });
  } catch (error) {
    console.error(`Error deleting like: ${error}`);
  }
};
