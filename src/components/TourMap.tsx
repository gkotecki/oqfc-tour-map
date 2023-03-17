import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export function TourMap() {
  return (
    <MapContainer center={[-25.43358, -49.30387]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[-25.43358, -49.30387]}>
        <Popup> Casa</Popup>
      </Marker>

      <Marker position={[-25.43, -49.3]}>
        <Popup> Teste 1</Popup>
      </Marker>

      <Marker position={[-25.44, -49.29]}>
        <Popup> Teste 2</Popup>
      </Marker>
    </MapContainer>
  );
}
