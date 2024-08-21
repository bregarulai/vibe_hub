import { redirect } from "next/navigation";
import React from "react";

import { validateRequest } from "@/lucia/auth";
import SessionProvider from "@/providers/SessionProvider";
import Navbar from "@/components/Navbar";
import MenuBar from "@/components/MenuBar";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();

  if (!session.user) redirect("/sign-in");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.24rem] hidden h-fit flex-none scroll-py-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
};

export default RootLayout;
