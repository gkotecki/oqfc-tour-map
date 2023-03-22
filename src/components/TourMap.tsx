import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

/**
 * OQFC Tour map component
 *
 * @todo fetch lat/long from api (geocoding)
 * @example
 * https://nominatim.openstreetmap.org/ui/search.html?q=R.+Prof.+Pedro+Viriato+Parigot+de+Souza%2C+600+-+Mossungu%C3%AA%2C+Curitiba+-+PR%2C+81200-100
 * https://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json&polygon=1&addressdetails=1
 * https://nominatim.org/release-docs/develop/api/Search/
 */
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
