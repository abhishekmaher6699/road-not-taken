import L from "leaflet";

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

export { redIcon, yellowIcon, greenIcon, flyToWithOffset };

type Latlang = {
  lat: number;
  lng: number;
}

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
  map.flyTo(shiftedLatLng, zoom);
}
