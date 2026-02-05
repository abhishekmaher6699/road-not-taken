"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { map } from "leaflet";
import {
  redIcon,
  yellowIcon,
  greenIcon,
  flyToWithOffset,
} from "@/lib/map-utils";
import { useBreakpoint } from "@/hooks/useBreakPoint";
import { PlacePreview } from "./map-client";
import { Category, Status } from "@/lib/generated/prisma/enums";

type Mode = "view" | "add";
type Latlang = {
  lat: number;
  lng: number;
};

type MapClickHandlerProps = {
  mode: Mode;
  disabled: boolean;
  onMapClick: (latlng: Latlang) => void;
};

type MapCameraControllerProps = {
  previewPin: Latlang | null;
  selectedPlace: PlacePreview | null;
};

type MapViewProps = {
  mode: Mode;
  places: PlacePreview[];
  previewPin: Latlang | null;
  pendingPin: Latlang | null;
  selectedPlace: PlacePreview | null;
  onMapClick: (latlng: Latlang) => void;
  onConfirmPin: () => void;
  onCancelPin: () => void;
  onSelectPlace: (place: PlacePreview) => void;
};
type PlacePopupProps = {
  place: PlacePreview;
  onSelect: (place: PlacePreview) => void;
};

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

function MapClickHandler({ mode, disabled, onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      if (mode !== "add") return;

      onMapClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}
function MapCameraController({
  previewPin,
  selectedPlace,
}: MapCameraControllerProps) {
  const map = useMap();
  const isDesktop = useBreakpoint(1024);

  useEffect(() => {
    const target = previewPin
      ? { lat: previewPin.lat, lng: previewPin.lng }
      : selectedPlace
        ? {
            lat: selectedPlace.latitude,
            lng: selectedPlace.longitude,
          }
        : null;

    if (!target) return;

    if (isDesktop) {
      const offsetX = window.innerWidth * 0.2;
      flyToWithOffset(map, target, offsetX, 0);
    } else {
      const offsetY = -window.innerHeight * 0.33;
      flyToWithOffset(map, target, 0, offsetY);
    }
  }, [previewPin, selectedPlace, isDesktop, map]);

  return null;
}

const categoryIconMap: Record<Category, L.Icon> = {
  [Category.STREET_ART]: redIcon,
  [Category.BUILDING]: yellowIcon,
  [Category.RUIN]: greenIcon,
};

export default function MapView({
  mode,
  previewPin,
  pendingPin,
  places,
  selectedPlace,
  onMapClick,
  onConfirmPin,
  onCancelPin,
  onSelectPlace,
}: MapViewProps) {
  const uniquePlaces = Array.from(
    new Map(places.map((p) => [p.id, p])).values(),
  );

  return (
    <>
      <MapContainer
        center={[18.5204, 73.8567]}
        zoom={15}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ZoomControl position="bottomright" />
        <MapCameraController previewPin={previewPin} selectedPlace={selectedPlace} />
        <Marker
          position={[18.52358212103968, 73.85345741832961]}
          icon={greenIcon}
        />

        <MapClickHandler
          mode={mode}
          onMapClick={onMapClick}
          disabled={!!pendingPin}
        />

        {pendingPin && (
          <Popup
            position={[pendingPin.lat, pendingPin.lng]}
            closeButton={false}
            closeOnClick={false}
            className=""
          >
            <div className="space-y-2 px-3 py-0 pb-3 pt-0.5" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-medium">Use this location?</p>

              <p className="text-xs text-muted-foreground">
                {pendingPin.lat.toFixed(5)}, {pendingPin.lng.toFixed(5)}
              </p>

              <div className="flex gap-2">
                <button
                  className="rounded bg-black px-3 py-1 text-white text-xs"
                  onClick={onConfirmPin}
                >
                  Confirm
                </button>

                <button
                  className="rounded border px-3 py-1 text-xs"
                  onClick={onCancelPin}
                >
                  Change
                </button>
              </div>
            </div>
          </Popup>
        )}

        {previewPin && (
          <Marker
            position={[previewPin.lat, previewPin.lng]}
            icon={yellowIcon}
          />
        )}

        {uniquePlaces.map((place) => (
          <Marker
            key={`${place.id}-${place.latitude}-${place.longitude}`}
            position={[place.latitude, place.longitude]}
            icon={categoryIconMap[place.category]}
          >
            <PlacePopup place={place} onSelect={onSelectPlace} />
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
