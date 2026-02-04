"use client";

import { LatLng } from "leaflet";
import MapView from "./map-view";
import ModeToggle from "./navbar/mode-toggle";
import { MapSearch } from "./navbar/search-bar";
import { useState } from "react";
import AddLocSidebar from "./sidebar-ui/addloc-sidebar";

type Mode = "view" | "add";

type Latlang = {
  lat: number;
  lng: number;
};

const MapClient = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("view");
  const [previewPin, setPreviewPin] = useState<Latlang | null>(null);
  const [pendingPin, setPendingPin] = useState<Latlang | null>(null);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapView
        mode={mode}
        previewPin={previewPin}
        pendingPin={pendingPin}
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
        // open={true}
        onClose={() => setPreviewPin(null)}
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
