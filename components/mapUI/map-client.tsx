"use client";

import { useEffect, useState } from "react";
import MapView from "./map-view";
import ModeToggle from "./navbar/mode-toggle";
import { MapSearch } from "./navbar/search-bar";
import AddLocSidebar from "./sidebar-ui/add-pin/addloc-sidebar";
import DetailsSidebar from "./sidebar-ui/details/details-sidebar";
import { Category, Status } from "@/lib/generated/prisma/enums";

type Mode = "view" | "add";
type ActiveSidebar = "add" | "details" | null;

type LatLng = {
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
  address: string;
  createdBy: string; // ✅ fixed
};

type MapClientProps = {
  session: {
    user?: {
      id?: string;
    };
  } | null;
};

const MapClient = ({ session }: MapClientProps) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("view");

  const [previewPin, setPreviewPin] = useState<LatLng | null>(null);
  const [pendingPin, setPendingPin] = useState<LatLng | null>(null);

  const [places, setPlaces] = useState<PlacePreview[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlacePreview | null>(null);

  const [activeSidebar, setActiveSidebar] =
    useState<ActiveSidebar>(null);


  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/place");
        if (!res.ok) throw new Error("Failed to fetch places");

        const data: PlacePreview[] = await res.json();

        setPlaces(
          data.filter(
            (p): p is PlacePreview =>
              !!p &&
              typeof p.id === "string" &&
              typeof p.latitude === "number" &&
              typeof p.longitude === "number"
          )
        );
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    fetchPlaces();
  }, []);




  const isOwner = selectedPlace?.createdBy === session?.user?.id;


  const closeDetails = () => {
    setActiveSidebar(null);
    setTimeout(() => setSelectedPlace(null), 200);
  };

  const handleDelete = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));

    if (selectedPlace?.id === placeId) {
      closeDetails();
    }
  };

  const handleEdit = (placeId: string) => {
    closeDetails();
  };


  

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapView
        mode={mode}
        previewPin={previewPin}
        pendingPin={pendingPin}
        places={places}
        selectedPlace={selectedPlace}
        onMapClick={setPendingPin}
        onConfirmPin={() => {
          setPreviewPin(pendingPin);
          setPendingPin(null);
          setSelectedPlace(null);
          setActiveSidebar("add");
        }}
        onCancelPin={() => setPendingPin(null)}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          setPreviewPin(null);
          setActiveSidebar("details");
        }}
      />

      <AddLocSidebar
        previewPin={previewPin}
        open={activeSidebar === "add"}
        onClose={() => {
          setPreviewPin(null);
          setActiveSidebar(null);
        }}
        onPlacesUpdate={setPlaces}
      />

      {activeSidebar === "details" && (
        <div
          className="fixed inset-0 z-300 bg-black/40"
          onClick={closeDetails}
        />
      )}

      <DetailsSidebar
        open={activeSidebar === "details"}
        place={selectedPlace}
        isOwner={isOwner}
        onClose={closeDetails}
        onDeleted={handleDelete}
        onEdit={handleEdit}
      />

      {/* Top Controls */}
      <div className="pointer-events-none absolute inset-0 z-400">
        <div className="pointer-events-auto absolute top-4 left-4 flex flex-wrap items-center gap-2 max-w-[calc(100vw-6rem)]">
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
