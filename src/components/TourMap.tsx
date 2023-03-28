import { LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import dict from '../../scripts/address-list.json';
import { Participants } from '../../scripts/get-address';
import { LocationMarker } from './LocationMarker';

export const CENTER = [-25.43358, -49.30387] as LatLngExpression;

function randomize(numValue: string) {
  const num = +(numValue || 0);
  const ratio = 0.00015;
  return `${num + (Math.random() * 2 * ratio - ratio)}`;
}

const markers = Object.entries(dict as Participants)
  .map(([key, value]) => ({
    key,
    data: (value.data || []).map(({ lat, lon, ...data }) => ({
      ...data,
      lat: randomize(lat),
      lon: randomize(lon),
    })),
  }))
  .filter(item => !!item.data);

console.log(markers);

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
    <MapContainer center={CENTER} zoom={14}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map(({ key, data }) =>
        data.map(({ display_name, lat, lon }) => (
          <Marker key={display_name} position={[+lat, +lon]}>
            <Popup>{key}</Popup>
          </Marker>
        )),
      )}

      <LocationMarker />
    </MapContainer>
  );
}
