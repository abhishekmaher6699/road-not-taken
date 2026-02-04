import { authSession } from "@/lib/auth-utils";
import { UserAvatarClient } from "./user-avatar-client";

export async function UserAvatar() {
  const session = await authSession();
  return <UserAvatarClient session={session} />;
}
