import { NextRequest } from "next/server";

import { validateRequest } from "@/lucia/auth";
import { getFollowingPosts } from "@/server/repositories/post.repository";
import { PostsPage } from "@/lib/type";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await getFollowingPosts({
      userId: user.id,
      pageSize,
      cursor,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(`Error while fetching posts following. Error: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
