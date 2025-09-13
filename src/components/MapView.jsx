import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in production
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView({ events, heightClass = 'h-96', zoom = 2, className = '' }) {
  // Center on first event if available
  let center = [20, 0];
  if (events && events[0] && events[0].geometry && events[0].geometry[0] && Array.isArray(events[0].geometry[0].coordinates)) {
    center = [events[0].geometry[0].coordinates[1], events[0].geometry[0].coordinates[0]];
  }
  return (
    <MapContainer center={center} zoom={zoom} className={`${heightClass} w-full rounded-lg ${className}`}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {events.map((event, idx) => (
        event.geometry && event.geometry[0] && (
          <Marker
            key={idx}
            position={[
              event.geometry[0].coordinates[1],
              event.geometry[0].coordinates[0],
            ]}
          >
            <Popup>
              <strong>{event.title}</strong>
              <br />
              {event.description || ''}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
