import { validateRequest } from "@/lucia/auth";
import { getWhoToFollow } from "@/server/repositories/user.repository";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      Trends Sidebar
      <WhoToFollow />
    </div>
  );
};

export default TrendsSidebar;

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const userToFollow = await getWhoToFollow(user.id);

  return (
    <div className="spacey5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
    </div>
  );
}
