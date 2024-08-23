import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { validateRequest } from "@/lucia/auth";
import { getWhoToFollow } from "@/server/repositories/user.repository";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const userToFollow = await getWhoToFollow(user.id);

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {userToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
          <Button>Follow</Button>
        </div>
      ))}
    </div>
  );
}
