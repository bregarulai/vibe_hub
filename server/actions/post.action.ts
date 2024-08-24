"use server";

import { validateRequest } from "@/lucia/auth";
import { deletePost, getPostById } from "@/server/repositories/post.repository";

export const deletePostAction = async (id: string) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const post = await getPostById(id);

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  await deletePost(id);
};
