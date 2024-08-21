import { redirect } from "next/navigation";
import React from "react";

import { validateRequest } from "@/lucia/auth";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();

  if (!session.user) redirect("/sign-in");

  return <>{children}</>;
};

export default RootLayout;
