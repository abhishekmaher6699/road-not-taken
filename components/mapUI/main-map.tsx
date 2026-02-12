import MapClient from "./map-client";
import { UserAvatar } from "./navbar/user-avatar";
import { authSession } from "@/lib/auth-utils";


export default async function MapPage() {

  const session = await authSession()

  return (
    <div className="relative h-screen w-full">
      <MapClient session = {session} />

      <div className="absolute top-4 right-4 z-500">
        <UserAvatar />
      </div>
    </div>
  );
}
