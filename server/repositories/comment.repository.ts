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

type GetCommentsParams = {
  postId: string;
  userId: string;
  cursor: string | null;
  pageSize: number;
};

export const getComments = async ({
  postId,
  userId,
  cursor,
  pageSize,
}: GetCommentsParams) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(userId),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return comments;
  } catch (error) {
    console.error(`Error getting comments: ${error}`);
    return [];
  }
};
