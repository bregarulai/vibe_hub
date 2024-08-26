import { FollowerInfo } from "@/lib/type";
import { validateRequest } from "@/lucia/auth";
import { createFollower } from "@/server/repositories/follow.repository";
import { getFollowers } from "@/server/repositories/user.repository";

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getFollowers({
      userId,
      loggingInUserId: loggedInUser.id,
    });

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(`Error fetching user followers: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await createFollower({
      userId,
      followerId: loggedInUser.id,
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error fetching user followers: ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
