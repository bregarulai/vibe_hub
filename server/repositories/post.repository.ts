import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/type";

export const getForYouPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
    });

    return posts;
  } catch (error) {
    console.error(`Error getting for you posts: ${error}`);
    return [];
  }
};
