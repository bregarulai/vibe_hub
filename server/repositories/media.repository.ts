"use server";

import prisma from "@/lib/prisma";
import { MediaType } from "@prisma/client";

export const createMedia = async ({
  fileUrl,
  fileType,
}: {
  fileUrl: string;
  fileType: MediaType;
}) => {
  try {
    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        type: fileType,
      },
    });

    if (!media) return null;

    return media;
  } catch (error) {
    console.error(`Error creating media: ${error}`);
    return null;
  }
};

export const getUnusedMedia = async () => {
  try {
    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    return unusedMedia;
  } catch (error) {
    console.error(`Error getting unused media: ${error}`);
    return [];
  }
};

type DeleteUnusedMediaParams = {
  unusedMedia: {
    id: string;
    url: string;
  }[];
};

export const deleteUnusedMedia = async ({
  unusedMedia,
}: DeleteUnusedMediaParams) => {
  try {
    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((media) => media.id),
        },
      },
    });
  } catch (error) {
    console.error(`Error deleting unused media: ${error}`);
  }
};
