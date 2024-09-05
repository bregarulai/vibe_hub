import prisma from "@/lib/prisma";

type CreateUserParams = {
  userId: string;
  username: string;
  email: string;
  hashedPassword: string;
};

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  return user;
};

export const createUser = async ({
  userId,
  username,
  email,
  hashedPassword,
}: CreateUserParams) => {
  await prisma.user.create({
    data: {
      id: userId,
      username,
      displayName: username,
      email,
      passwordHash: hashedPassword,
    },
  });
};
