import {
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { PlacePopupProps, MapCameraControllerProps, MapClickHandlerProps, MapViewProps } from "@/lib/types";
import { Status } from "@/lib/generated/prisma/enums";


function PlacePopup({ place, onSelect }: PlacePopupProps) {
  const map = useMap();

  return (
    <Popup>
      <div className="w-47.5 overflow-hidden rounded-lg bg-white">
        {/* Image hero */}
        <div className="relative h-32.5">
          {place.thumbnail ? (
            <img
              src={place.thumbnail}
              alt={place.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-300" />
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Name */}
          <p className="absolute bottom-0 left-2 right-2 text-[13px] text-white leading-tight line-clamp-2">
            {place.name}
          </p>

          {/* Status */}
          <span
            className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] text-white ${
              place.isActive === Status.ACTIVE
                ? "bg-green-600/90"
                : "bg-red-600/90"
            }`}
          >
            {place.isActive === Status.ACTIVE ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-2 py-2 text-[10px]">
          <span className="uppercase tracking-wide text-gray-600">
            {place.category}
          </span>

          <button
            className="text-[10px] text-blue-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              map.closePopup(); // 👈 popup closes itself
              onSelect(place); // 👈 sidebar opens
            }}
          >
            Details →
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default PlacePopup