import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/type";

type CreateCommentParams = {
  content: string;
  postId: string;
  userId: string;
};

export const createComment = async ({
  content,
  postId,
  userId,
}: CreateCommentParams) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: getCommentDataInclude(userId),
    });

    return comment;
  } catch (error) {
    console.error(`Error creating comment: ${error}`);
    return null;
  }
};
