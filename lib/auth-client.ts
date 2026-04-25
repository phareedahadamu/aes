import { createAuthClient } from "better-auth/react";
export const { signIn, signUp, signOut, useSession, $ERROR_CODES, getSession } = createAuthClient();
