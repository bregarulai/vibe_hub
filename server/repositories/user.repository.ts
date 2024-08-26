"use server";

import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/type";

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

export const getWhoToFollow = async (id: string) => {
  try {
    const usersToFollow = await prisma.user.findMany({
      where: {
        NOT: {
          id: id,
        },
      },
      select: userDataSelect,
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
