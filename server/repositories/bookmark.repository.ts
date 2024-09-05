import prisma from "@/lib/prisma";

type GetBookmarksParams = {
  postId: string;
  userId: string;
};

export const getBookmark = async ({ postId, userId }: GetBookmarksParams) => {
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

type CreateBookmarksParams = {
  postId: string;
  userId: string;
};

export const createBookmark = async ({
  postId,
  userId,
}: CreateBookmarksParams) => {
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

type DeleteBookmarksParams = {
  postId: string;
  userId: string;
};

export const deleteBookmark = async ({
  postId,
  userId,
}: DeleteBookmarksParams) => {
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
