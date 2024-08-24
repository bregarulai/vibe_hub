import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/type";

type GetForYouPostsParams = {
  pageSize: number;
  cursor: string | undefined;
};

export const getForYouPosts = async ({
  pageSize,
  cursor,
}: GetForYouPostsParams) => {
  try {
    const posts = await prisma.post.findMany({
      include: postDataInclude,
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
