import MapClient from "./map-client";
import { UserAvatar } from "./navbar/user-avatar";

export default function MapPage() {
  return (
    <div className="relative h-screen w-full">
      <MapClient />

      <div className="absolute top-4 right-4 z-500">
        <UserAvatar />
      </div>
    </div>
  );
}
