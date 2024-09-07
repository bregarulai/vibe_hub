"use server";

import { PostData } from "@/lib/type";
import { createCommentSchema } from "@/lib/validation";
import { validateRequest } from "@/lucia/auth";
import { createComment } from "@/server/repositories/comment.repository";

type SubmitCommentParams = {
  post: PostData;
  content: string;
};

export const submitCommentAction = async ({
  post,
  content,
}: SubmitCommentParams) => {
  try {
    const { user } = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const { content: contentValidated } = createCommentSchema.parse({
      content,
    });

    const newComment = await createComment({
      content: contentValidated,
      postId: post.id,
      userId: user.id,
    });

    return newComment;
  } catch (error) {
    console.error(`Error while submitting comment: ${error}`);
    throw new Error("Failed to submit comment");
  }
};
