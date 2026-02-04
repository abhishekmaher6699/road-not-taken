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

type Mode = "view" | "add";
type Latlang = {
  lat: number;
  lng: number;
};

function MapClickHandler({
  mode,
  disabled,
  onMapClick,
}: {
  mode: Mode;
  disabled: boolean;
  onMapClick: (latlng: Latlang) => void;
}) {
  const map = useMapEvents({
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

function MapCameraController({ previewPin }: { previewPin: Latlang | null }) {
  const map = useMap();
  const isDesktop = useBreakpoint(1024);

  useEffect(() => {
    if (!previewPin) return;

    if (isDesktop) {
      const offsetX = window.innerWidth * 0.2;
      flyToWithOffset(map, previewPin, offsetX, 0);
    } else {
      const offsetY = -window.innerHeight * 0.33;
      flyToWithOffset(map, previewPin, 0, offsetY);
    }
  }, [previewPin, isDesktop, map]);

  return null;
}

export default function MapView({
  mode,
  previewPin,
  pendingPin,
  places,
  onMapClick,
  onConfirmPin,
  onCancelPin,
}: {
  mode: Mode;
  places: PlacePreview[];
  previewPin: Latlang | null;
  pendingPin: Latlang | null;
  onMapClick: (latlng: Latlang) => void;
  onConfirmPin: () => void;
  onCancelPin: () => void;
}) {


  const uniquePlaces = Array.from(
  new Map(places.map((p) => [p.id, p])).values()
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
        <MapCameraController previewPin={previewPin} />
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
          >
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
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
          <Marker  key={`${place.id}-${place.latitude}-${place.longitude}`} position={[place.latitude, place.longitude]} icon={redIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{place.name}</p>
                {place.thumbnail && (
                  <img
                    src={place.thumbnail}
                    className="h-20 w-full object-cover rounded"
                    alt={place.name}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
