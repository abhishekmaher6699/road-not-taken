"use client";

import MapView from "./map-view";
import ModeToggle from "./navbar/mode-toggle";
import { MapSearch } from "./navbar/search-bar";
import { use, useEffect, useState } from "react";
import AddLocSidebar from "./sidebar-ui/addloc-sidebar";
import { Category, Status } from "@/lib/generated/prisma/enums";

type Mode = "view" | "add";

type Latlang = {
  lat: number;
  lng: number;
};

export type PlacePreview = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: Category;
  isActive: Status;
  thumbnail: string | null;
};

const MapClient = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("view");
  const [previewPin, setPreviewPin] = useState<Latlang | null>(null);
  const [pendingPin, setPendingPin] = useState<Latlang | null>(null);
  const [places, setPlaces] = useState<PlacePreview[]>([]);

useEffect(() => {
  console.log("Fetching places from /api/place");
  fetch("/api/place")
    .then((res) => res.json())
    .then((data: PlacePreview[]) => {
      setPlaces(
        data.filter(
          (p): p is PlacePreview =>
            Boolean(p) &&
            typeof p.id === "string" &&
            typeof p.latitude === "number" &&
            typeof p.longitude === "number"
        )
      );
    })
    .catch(console.error);
}, []);

useEffect(() => {
  console.log("Rendering MapClient with places:", places);
}, [places]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapView
        mode={mode}
        previewPin={previewPin}
        pendingPin={pendingPin}
        places={places}
        onMapClick={(latlng) => {
          console.log("Map clicked at:", latlng);
          setPendingPin(latlng);
        }}
        onConfirmPin={() => {
          setPreviewPin(pendingPin);
          setPendingPin(null);
        }}
        onCancelPin={() => {
          setPendingPin(null);
        }}
      />

<AddLocSidebar
  previewPin={previewPin}
  open={!!previewPin}
  onClose={() => setPreviewPin(null)}
  onPlacesUpdate={setPlaces}
/>


      <div className="pointer-events-none absolute inset-0 z-400">
        <div
          className="
            pointer-events-auto
            absolute
            top-4 left-4
            flex flex-wrap items-center gap-2 max-w-[calc(100vw-6rem)]
          "
        >
          <div className="w-full sm:w-auto">
            <MapSearch value={query} onChange={setQuery} />
          </div>

          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </div>
    </div>
  );
};

export default MapClient;
