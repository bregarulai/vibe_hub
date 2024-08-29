import { cache } from "react";
import { Metadata } from "next";
import { formatDate } from "date-fns";
import { notFound } from "next/navigation";

import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/type";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lucia/auth";
import TrendsSidebar from "@/components/shared/TrendsSidebar";
import UserAvatar from "@/components/shared/UserAvatar";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "@/components/shared/FollowerCount";
import FollowButton from "@/components/FollowButton";
import { Separator } from "@/components/ui/separator";
import UserPostsFeed from "@/components/UserPostsFeed";
import Linkify from "@/components/shared/Linkify";
import EditProfileButton from "@/components/EditProfileButton";

type ProfilePageProps = {
  params: { username: string };
};

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params: { username },
}: ProfilePageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user ? user?.displayName : ""} ${user ? `(@${user?.username})` : ""}`,
  };
}

const ProfilePage = async ({ params: { username } }: ProfilePageProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return <p>You&apos;re not authorized to view this page.</p>;
  }

  const user = await getUser(username, loggedInUser.id);

  if (!user) notFound();
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="min-w-0, w-full space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s Posts
          </h2>
        </div>
        <UserPostsFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default ProfilePage;

type UserProfileProps = {
  user: UserData;
  loggedInUserId: string;
};

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <Separator />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
