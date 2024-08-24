import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/type";

type GetForYouPostsParams = {
  pageSize: number;
  cursor: string | undefined;
};

export const getForYouPosts = async ({
  pageSize,
  cursor,
}: GetForYouPostsParams) => {
  try {
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return posts;
  } catch (error) {
    console.error(`Error getting for you posts: ${error}`);
    return [];
  }
};

export const getPostById = async (id: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    return post;
  } catch (error) {
    console.error(`Error getting post by id: ${error}`);
  }
};

export const deletePost = async (id: string) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id },
      include: postDataInclude,
    });

    return deletedPost;
  } catch (error) {
    console.error(`Error deleting post: ${error}`);
  }
};
