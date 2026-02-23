"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  redIcon,
  yellowIcon,
  greenIcon,
  MapCameraController,
  MapClickHandler
} from "@/lib/map-utils";
import { MapViewProps } from "@/lib/types";
import { Category, Status } from "@/lib/generated/prisma/enums";
import PlacePopup from "./map-comps/map-popup";
import * as esri from "esri-leaflet";


const categoryIconMap: Record<Category, L.Icon> = {
  [Category.STREET_ART]: redIcon,
  [Category.BUILDING]: yellowIcon,
  [Category.RUIN]: greenIcon,
};

 
function EsriBasemap({ basemap = "Streets" }) {
  const map = useMap();

  useEffect(() => {
    const layer = esri.basemapLayer(basemap).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, basemap]);

  return null;
}

export default function MapView({
  mode,
  previewPin,
  pendingPin,
  places,
  basemap,
  selectedPlace,
  onMapClick,
  onConfirmPin,
  onCancelPin,
  onSelectPlace,
}: MapViewProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);


  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, []);

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


        {basemap === "imagery" ? (
          <EsriBasemap basemap="Imagery" />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        )}

        <ZoomControl position="bottomright" />

        <MapCameraController
          previewPin={previewPin}
          selectedPlace={selectedPlace}
        />

        <MapClickHandler
          mode={mode}
          onMapClick={onMapClick}
          disabled={!!pendingPin}
        />

        {userLocation && (
          <>
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={20}
              pathOptions={{
                color: "#3b82f7",
                fillColor: "#3b82f6",
                fillOpacity: 0.15,
                weight: 1,
              }}
            />

            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={5}
              pathOptions={{
                color: "#3b82f9",
                fillColor: "#3b82f6",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          </>
        )}

        {pendingPin && (
          <Popup
            position={[pendingPin.lat, pendingPin.lng]}
            closeButton={false}
            closeOnClick={false}
            className=""
          >
            <div
              className="space-y-2 px-3 py-0 pb-3 pt-0.5"
              onClick={(e) => e.stopPropagation()}
            >
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
