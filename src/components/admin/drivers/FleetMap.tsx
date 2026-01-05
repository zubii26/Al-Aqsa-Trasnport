'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet default icon issue
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for Status
const onlineIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const offlineIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface DriverLocation {
    _id: string;
    name: string;
    isOnline: boolean;
    location?: {
        lat: number;
        lng: number;
        lastUpdated: string;
    };
}

interface FleetMapProps {
    drivers: DriverLocation[];
}

const CENTER = [21.4858, 39.1925]; // Jeddah default

export default function FleetMap({ drivers }: FleetMapProps) {
    // Filter drivers with valid location
    const validDrivers = drivers.filter(d => d.location && d.location.lat && d.location.lng);

    return (
        <MapContainer
            center={CENTER as L.LatLngExpression}
            zoom={10}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Nice clean map style
            />

            {validDrivers.map(driver => (
                <Marker
                    key={driver._id}
                    position={[driver.location!.lat, driver.location!.lng]}
                    icon={driver.isOnline ? onlineIcon : offlineIcon}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold">{driver.name}</h3>
                            <p className="text-sm text-gray-500">
                                {driver.isOnline ? 'Online' : 'Offline'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                last update: {new Date(driver.location!.lastUpdated).toLocaleTimeString()}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
