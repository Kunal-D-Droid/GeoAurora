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

export default function MobileMapView({ events, heightClass = 'h-64', zoom = 2, className = '' }) {
  // Center on first event if available
  let center = [20, 0];
  if (events && events[0] && events[0].geometry && events[0].geometry[0] && Array.isArray(events[0].geometry[0].coordinates)) {
    center = [events[0].geometry[0].coordinates[1], events[0].geometry[0].coordinates[0]];
  }
  
  return (
    <div className={`mobile-map-container w-full ${className}`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className={`${heightClass} w-full rounded-lg`}
        style={{ 
          touchAction: 'pan-x pan-y',
          width: '100%',
          height: '100%'
        }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
      >
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
              <Popup className="mobile-popup">
                <div className="p-3 max-w-xs">
                  <strong className="text-sm font-semibold text-gray-900 block mb-2">
                    {event.title || 'Event'}
                  </strong>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {event.description ? event.description.slice(0, 120) + '...' : 'No description available'}
                  </p>
                  {event.geometry?.[0]?.date && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(event.geometry[0].date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      
    </div>
  );
}
