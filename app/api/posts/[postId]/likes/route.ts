import { LikeInfo } from "@/lib/type";
import { validateRequest } from "@/lucia/auth";
import { createLike, deleteLike } from "@/server/repositories/like.repository";
import { getLikes } from "@/server/repositories/user.repository";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await getLikes({
      postId,
      userId: loggedInUser.id,
    });
    if (!post)
      return Response.json({ error: "post not found" }, { status: 404 });

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(`Error fetching user likes: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await createLike({
      userId: loggedInUser.id,
      postId,
    });

    return new Response();
  } catch (error) {
    console.error(`Error fetching user likes: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await deleteLike({
      userId: loggedInUser.id,
      postId,
    });

    return new Response();
  } catch (error) {
    console.error(`Error deleting like: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
