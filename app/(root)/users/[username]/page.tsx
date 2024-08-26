import { cache } from "react";

import { getUserDataSelect } from "@/lib/type";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { validateRequest } from "@/lucia/auth";
import { Metadata } from "next";
import TrendsSidebar from "@/components/shared/TrendsSidebar";

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
    title: `${user?.displayName} (@${user?.username})`,
  };
}

const ProfilePage = async ({ params: { username } }: ProfilePageProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return <p>You&apos;re not authorized to view this page.</p>;
  }

  const user = await getUser(username, loggedInUser.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="min-w-0, w-full space-y-5"></div>
      <TrendsSidebar />
    </main>
  );
};

export default ProfilePage;
