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
