import { redirect } from "next/navigation";
import React from "react";

import { validateRequest } from "@/lucia/auth";
import SessionProvider from "@/providers/SessionProvider";
import Navbar from "@/components/Navbar";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();

  if (!session.user) redirect("/sign-in");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </div>
    </SessionProvider>
  );
};

export default RootLayout;
