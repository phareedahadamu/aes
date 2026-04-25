import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import { Role } from "@/generated/prisma/enums";

export const auth = betterAuth({
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
    expiresIn: 60 * 60, // 60 minutes
    updateAge: 60 * 20, // 20 minutes
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "REPORTS",
        input: true,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
      isSuperAdmin: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user & {
  role: Role;
  isActive: boolean;
  isSuperAdmin: boolean;
};

const getSession = cache(async (headerList: Headers) => {
  return await auth.api.getSession({
    headers: headerList,
  });
});

export async function getAuthUser(): Promise<User | null> {
  try {
    const session = await getSession(await headers());
    if (!session || !session.user) {
      return null;
    }
    const user = session?.user as User;
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get session", { cause: "Connection Error" });
  }
}
