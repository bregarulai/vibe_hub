"use server";

import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/type";
import { UpdateUserProfileValues } from "@/lib/validation";

type getFollowersParams = {
  userId: string;
  loggingInUserId: string;
};

export const getFollowers = async ({
  userId,
  loggingInUserId,
}: getFollowersParams) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggingInUserId,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error(`Error getting user by id: ${error}`);
  }
};

type GetLikesParams = {
  postId: string;
  userId: string;
};

export const getLikes = async ({ postId, userId }: GetLikesParams) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.error(`Error getting likes: ${error}`);
  }
};

export const getWhoToFollow = async (id: string) => {
  try {
    const usersToFollow = await prisma.user.findMany({
      where: {
        NOT: {
          id: id,
        },
        followers: {
          none: {
            followerId: id,
          },
        },
      },
      select: getUserDataSelect(id),
      take: 5,
    });
    return usersToFollow;
  } catch (error) {
    console.error(`Error getting users to follow: ${error}`);
    return [];
  }
};

export const getTrendingTopics = async () => {
  try {
    const results = await prisma.$queryRaw<
      { hashtag: string; count: bigint }[]
    >`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
          `;

    return results;
  } catch (error) {
    console.error(`Error getting trending topics: ${error}`);
    return [];
  }
};

export const getUserByUsernameWithData = async ({
  username,
  loggedInUserId,
}: {
  username: string;
  loggedInUserId: string;
}) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUserId),
    });

    return user;
  } catch (error) {
    console.error(`Error getting user by username: ${error}`);
    return null;
  }
};

export const updateUserAvatar = async ({
  userId,
  newAvatarUrl,
}: {
  userId: string;
  newAvatarUrl: string;
}) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: newAvatarUrl,
      },
    });
  } catch (error) {
    console.error(`Error updating user avatar: ${error}`);
  }
};

export const updateUserProfile = async ({
  userId,
  values,
}: {
  userId: string;
  values: UpdateUserProfileValues;
}) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: values,
      select: getUserDataSelect(userId),
    });

    return updatedUser;
  } catch (error) {
    console.error(`Error updating user profile: ${error}`);
  }
};
