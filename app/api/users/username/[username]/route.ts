import { validateRequest } from "@/lucia/auth";
import { getUserByUsernameWithData } from "@/server/repositories/user.repository";

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserByUsernameWithData({
      username,
      loggedInUserId: loggedInUser.id,
    });

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json(user);
  } catch (error) {
    console.error(`Error while fetching user with username ${error}`);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
