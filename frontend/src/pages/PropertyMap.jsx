import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = ({ properties, center = [-1.286389, 36.817223] }) => {
  return (
    <MapContainer center={center} zoom={12} style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {properties.map(property => (
        property.coordinates?.lat && property.coordinates?.lng && (
          <Marker key={property._id} position={[property.coordinates.lat, property.coordinates.lng]}>
            <Popup>
              <div className="p-2">
                <img src={property.images?.[0]?.url} alt={property.title} className="w-32 h-24 object-cover rounded mb-2" />
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-sm">{property.location}</p>
                <p className="text-green-600 font-bold">KSh {property.price}/month</p>
                <a href={`/properties/${property._id}`} className="text-blue-600 text-sm">View Details</a>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default PropertyMap;