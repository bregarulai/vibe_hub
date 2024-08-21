import React from "react";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lucia/auth";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <>{children}</>;
};

export default AuthLayout;
