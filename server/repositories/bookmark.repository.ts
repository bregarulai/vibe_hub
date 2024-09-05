import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/type";

type GetBookmarkParams = {
  postId: string;
  userId: string;
};

export const getBookmark = async ({ postId, userId }: GetBookmarkParams) => {
  try {
    const bookmarks = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return bookmarks;
  } catch (error) {
    console.error(`Error fetching user likes: ${error}`);
    return [];
  }
};

type CreateBookmarkParams = {
  postId: string;
  userId: string;
};

export const createBookmark = async ({
  postId,
  userId,
}: CreateBookmarkParams) => {
  try {
    await prisma.bookmark.upsert({
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
    console.error(`Error creating bookmark: ${error}`);
    return;
  }
};

type DeleteBookmarkParams = {
  postId: string;
  userId: string;
};

export const deleteBookmark = async ({
  postId,
  userId,
}: DeleteBookmarkParams) => {
  try {
    await prisma.bookmark.deleteMany({
      where: {
        userId,
        postId,
      },
    });
  } catch (error) {
    console.error(`Error deleting bookmark: ${error}`);
    return;
  }
};

type GetBookmarksParams = {
  pageSize: number;
  cursor?: string;
  userId: string;
};

export const getBookmarks = async ({
  pageSize,
  cursor,
  userId,
}: GetBookmarksParams) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: getPostDataInclude(userId),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return bookmarks;
  } catch (error) {
    console.error(`Error getting bookmarks: ${error}`);
    return [];
  }
};
