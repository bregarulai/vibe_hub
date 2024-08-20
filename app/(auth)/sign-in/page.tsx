import Link from "next/link";
import React from "react";
import Image from "next/image";

import signInImage from "@/assets/login-image.jpg";
import SignInForm from "@/components/forms/SignInForm";

export const metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Sign in to VibeHub</h1>
          <div className="space-y-5">
            <SignInForm />
            <Link href="/sign-up" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          priority
          src={signInImage}
          alt="signup-image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default SignInPage;
