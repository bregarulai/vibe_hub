"use server";

import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/type";

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
