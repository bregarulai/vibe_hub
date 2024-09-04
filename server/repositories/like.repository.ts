import prisma from "@/lib/prisma";

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
