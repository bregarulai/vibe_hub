import { validateRequest } from "@/lucia/auth";
import { getForYouPosts } from "@/server/repositories/post.repository";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await getForYouPosts();

    return Response.json(posts);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
