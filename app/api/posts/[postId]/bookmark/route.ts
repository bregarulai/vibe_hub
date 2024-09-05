import { BookmarkInfo } from "@/lib/type";
import { validateRequest } from "@/lucia/auth";
import {
  createBookmark,
  deleteBookmark,
  getBookmark,
} from "@/server/repositories/bookmark.repository";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const bookmark = await getBookmark({
      postId,
      userId: loggedInUser.id,
    });

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
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

    await createBookmark({
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

    await deleteBookmark({
      userId: loggedInUser.id,
      postId,
    });

    return new Response();
  } catch (error) {
    console.error(`Error deleting like: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
