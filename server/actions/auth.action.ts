"use server";

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";

import {
  signInSchema,
  SignInValues,
  signUpSchema,
  SignUpValues,
} from "@/lib/validation";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/server/repositories/auth.repository";
import { lucia } from "@/lucia/auth";

export const signUpAction = async (
  credentials: SignUpValues,
): Promise<{ error: string }> => {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);
    const existingUsername = await getUserByUsername(username);

    if (existingUsername) {
      return { error: "Username already taken" };
    }

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return { error: "Email already taken" };
    }

    await createUser({ userId, username, email, hashedPassword });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong.  Please try again." };
  }
};

export const signInAction = async (
  credentials: SignInValues,
): Promise<{ error: string }> => {
  try {
    const { username, password } = signInSchema.parse(credentials);

    const existingUser = await getUserByUsername(username);

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Username or password is incorrect" };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    if (!validPassword) {
      return { error: "Username or password is incorrect" };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong.  Please try again." };
  }
};
