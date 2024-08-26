"use server";

import prisma from "@/lib/prisma";

type CreateFollowerParams = {
  userId: string;
  followerId: string;
};

export const createFollower = async ({
  userId,
  followerId,
}: CreateFollowerParams) => {
  try {
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
      create: {
        followerId,
        followingId: userId,
      },
      update: {},
    });
  } catch (error) {
    console.error(`Error creating follower: ${error}`);
  }
};
