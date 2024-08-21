import { redirect } from "next/navigation";
import React from "react";

import { validateRequest } from "@/lucia/auth";
import SessionProvider from "@/providers/SessionProvider";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();

  if (!session.user) redirect("/sign-in");

  return <SessionProvider value={session}>{children}</SessionProvider>;
};

export default RootLayout;
