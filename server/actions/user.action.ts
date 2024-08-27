"use server";

import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { validateRequest } from "@/lucia/auth";
import { updateUserProfile } from "@/server/repositories/user.repository";

export const updateUserProfileAction = async (
  values: UpdateUserProfileValues,
) => {
  try {
    const validatedValues = updateUserProfileSchema.parse(values);

    const { user } = await validateRequest();

    if (!user) throw new Error("Unauthorized");

    const updatedUser = await updateUserProfile({
      userId: user.id,
      values: validatedValues,
    });

    return updatedUser;
  } catch (error) {
    console.error(`Error updating user profile: ${error}`);
  }
};
