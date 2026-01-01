'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Car, Clock, User, Phone } from 'lucide-react';

// Fix Leaflet Default Icon
// delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom Car Icon
const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png', // Or a local asset
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

interface DriverLocation {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isOnline: boolean;
    location: {
        lat: number;
        lng: number;
        lastUpdated: string;
        heading: number;
    };
}

export default function AdminMap() {
    const [drivers, setDrivers] = useState<DriverLocation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDrivers = async () => {
        try {
            const res = await fetch('/api/admin/tracking');
            if (res.ok) {
                const data = await res.json();
                setDrivers(data);
            }
        } catch (error) {
            console.error('Failed to fetch tracking data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
        // Poll every 10 seconds
        const interval = setInterval(fetchDrivers, 10000);
        return () => clearInterval(interval);
    }, []);

    // Center map on Makkah by default
    const center: [number, number] = [21.4225, 39.8262];

    return (
        <div className="h-[calc(100vh-120px)] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative z-0">
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {drivers.map(driver => (
                    driver.location && (
                        <Marker
                            key={driver.id}
                            position={[driver.location.lat, driver.location.lng]}
                        // icon={carIcon} // Use Custom Icon if desired, or default
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                        {driver.name}
                                        {driver.isOnline ?
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" /> :
                                            <span className="w-2 h-2 rounded-full bg-slate-300" title="Offline" />
                                        }
                                    </h3>
                                    <div className="text-sm space-y-1 text-slate-600">
                                        <p className="flex items-center gap-2">
                                            <Phone size={14} /> {driver.phone || 'No Phone'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock size={14} />
                                            {new Date(driver.location.lastUpdated).toLocaleTimeString()}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2">
                                            Lat: {driver.location.lat.toFixed(4)}, Lng: {driver.location.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {loading && drivers.length === 0 && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            )}
        </div>
    );
}
