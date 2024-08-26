import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/type";

type GetForYouPostsParams = {
  pageSize: number;
  cursor: string | undefined;
  userId: string;
};

type GetFollowingPostsParams = {
  pageSize: number;
  cursor: string | undefined;
  userId: string;
};

type GetUserProfilePostsParams = {
  pageSize: number;
  cursor: string | undefined;
  profilePageUserId: string;
  loggedInUserId: string;
};

export const getForYouPosts = async ({
  pageSize,
  cursor,
  userId,
}: GetForYouPostsParams) => {
  try {
    const posts = await prisma.post.findMany({
      include: getPostDataInclude(userId),
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

export const getUserProfilePosts = async ({
  pageSize,
  cursor,
  profilePageUserId,
  loggedInUserId,
}: GetUserProfilePostsParams) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: profilePageUserId },
      include: getPostDataInclude(loggedInUserId),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return posts;
  } catch (error) {
    console.error(`Error getting user profile posts: ${error}`);
    return [];
  }
};

export const getFollowingPosts = async ({
  pageSize,
  cursor,
  userId,
}: GetFollowingPostsParams) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: getPostDataInclude(userId),
    });

    return posts;
  } catch (error) {
    console.error(`Error getting following posts: ${error}`);
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
      include: getPostDataInclude(id),
    });

    return deletedPost;
  } catch (error) {
    console.error(`Error deleting post: ${error}`);
  }
};
