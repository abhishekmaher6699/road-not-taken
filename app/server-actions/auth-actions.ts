import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

export const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/")
        },
      },
    });
}