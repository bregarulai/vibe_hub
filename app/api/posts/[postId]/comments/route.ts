import { NextRequest } from "next/server";

import { validateRequest } from "@/lucia/auth";
import { getComments } from "@/server/repositories/comment.repository";
import { CommentsPage } from "@/lib/type";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor");

    const pageSize = 5;

    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const comments = await getComments({
      postId,
      userId: user.id,
      cursor,
      pageSize,
    });

    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    const data: CommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
