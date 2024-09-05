import { NextRequest } from "next/server";

import { validateRequest } from "@/lucia/auth";
import { getForYouPosts } from "@/server/repositories/post.repository";
import { PostsPage } from "@/lib/type";
import { getBookmarks } from "@/server/repositories/bookmark.repository";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const bookmarks = await getBookmarks({ pageSize, cursor, userId: user.id });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: PostsPage = {
      posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
