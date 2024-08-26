"use server";

import prisma from "@/lib/prisma";

type CreateFollowerParams = {
  userId: string;
  loggedInUserId: string;
};

export const createFollower = async ({
  userId,
  loggedInUserId,
}: CreateFollowerParams) => {
  try {
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUserId,
          followingId: userId,
        },
      },
      create: {
        followerId: loggedInUserId,
        followingId: userId,
      },
      update: {},
    });
  } catch (error) {
    console.error(`Error creating follower: ${error}`);
  }
};

type DeleteFollowerParams = {
  userId: string;
  followerId: string;
};

export const deleteFollower = async ({
  userId,
  followerId,
}: DeleteFollowerParams) => {
  try {
    await prisma.follow.deleteMany({
      where: {
        followerId: followerId,
        followingId: userId,
      },
    });
  } catch (error) {
    console.error(`Error deleting follower: ${error}`);
  }
};
