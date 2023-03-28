import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import { CENTER } from './TourMap';

// TODO: review navigator.geolocation implementation
// TODO: get coords by google.maps link from participants page

export function LocationMarker() {
  const [position, setPosition] = useState(CENTER);

  const map = useMapEvents({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latLong = [position.coords.latitude, position.coords.longitude] as LatLngExpression;
        console.log({ position });
        // alert(`position: ${latLong}`);
        setPosition(latLong);
        map.flyTo(latLong, map.getZoom());
      },
      error => {
        alert('Position error');
      },
      {},
    );
  }, []);

  return position === null ? null : (
    <CircleMarker center={position} color="red">
      <Popup>You are here</Popup>
    </CircleMarker>
  );
}
