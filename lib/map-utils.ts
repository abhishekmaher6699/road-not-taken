import L from "leaflet";
import { Latlang } from "./types";
import { useEffect } from "react";
import { MapCameraControllerProps, MapClickHandlerProps } from "./types";
import { useMap, useMapEvents } from "react-leaflet";
import { useBreakpoint } from "@/hooks/useBreakPoint";



const redIcon = new L.Icon({
  iconUrl: "/red.png",           
  iconSize: [28, 32],            
  iconAnchor: [14, 32],          
  popupAnchor: [0, -32],
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [4, 4],
});

const yellowIcon = new L.Icon({
  iconUrl: "/yellow.png",           
  iconSize: [28, 32],            
  iconAnchor: [14, 32],          
  popupAnchor: [0, -32],
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [4, 4],
});

const greenIcon = new L.Icon({
  iconUrl: "/green.png",           
  iconSize: [28, 32],            
  iconAnchor: [14, 32],          
  popupAnchor: [0, -32],
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [4, 4],
});

export { redIcon, yellowIcon, greenIcon, flyToWithOffset, MapCameraController,MapClickHandler };


function flyToWithOffset(
  map: L.Map,
  latlng: Latlang,
  offsetX = 0,
  offsetY = 0
) {
  const zoom = map.getZoom();
  const point = map.project(latlng, zoom);
  const shiftedPoint = point.subtract([offsetX, offsetY]);
  const shiftedLatLng = map.unproject(shiftedPoint, zoom);
  map.flyTo(shiftedLatLng, zoom, {duration: 0.3});
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
