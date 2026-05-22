'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Map, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Setup Leaflet icon fallback just in case
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

// Generate premium custom divIcons using tailwind classes
const getPickupIcon = () => {
    if (typeof window === 'undefined') return undefined;
    return L.divIcon({
        className: 'custom-marker-pickup',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></div>
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 border-2 border-slate-900 flex items-center justify-center shadow-lg relative z-10 transition-all hover:scale-110">
                    <span class="w-3.5 h-3.5 rounded-full bg-white shadow-inner flex items-center justify-center">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    </span>
                </div>
                <div class="absolute -bottom-1 w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

const getDropoffIcon = () => {
    if (typeof window === 'undefined') return undefined;
    return L.divIcon({
        className: 'custom-marker-dropoff',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-pulse"></div>
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-red-400 border-2 border-slate-900 flex items-center justify-center shadow-lg relative z-10 transition-all hover:scale-110">
                    <span class="w-3.5 h-3.5 rounded-full bg-white shadow-inner flex items-center justify-center">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    </span>
                </div>
                <div class="absolute -bottom-1 w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

interface CustomRouteMapProps {
    onRouteCalculated: (data: {
        pickup: { lat: number; lng: number; address: string };
        dropoff: { lat: number; lng: number; address: string };
        distanceKm: number;
        durationMin: number;
        geometry: string;
    }) => void;
    initialPickup?: { lat: number; lng: number; address: string } | null;
    initialDropoff?: { lat: number; lng: number; address: string } | null;
}

// Map Event Listener for Clicks
function MapEventsHandler({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

// Auto Fit Map bounds to show route/markers dynamically
function MapBoundsManager({
    pickup,
    dropoff,
    routePolyline,
}: {
    pickup: any;
    dropoff: any;
    routePolyline: any;
}) {
    const map = useMap();
    useEffect(() => {
        if (pickup && dropoff) {
            const bounds = L.latLngBounds([
                [pickup.lat, pickup.lng],
                [dropoff.lat, dropoff.lng],
            ]);
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 1 });
        } else if (pickup) {
            map.setView([pickup.lat, pickup.lng], 13, { animate: true });
        }
    }, [pickup, dropoff, routePolyline, map]);
    return null;
}

export default function CustomRouteMap({
    onRouteCalculated,
    initialPickup = null,
    initialDropoff = null,
}: CustomRouteMapProps) {
    const [pickup, setPickup] = useState<{ lat: number; lng: number; address: string } | null>(initialPickup);
    const [dropoff, setDropoff] = useState<{ lat: number; lng: number; address: string } | null>(initialDropoff);
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [durationMin, setDurationMin] = useState<number | null>(null);
    const [routePolyline, setRoutePolyline] = useState<[number, number][] | null>(null);
    const [geometry, setGeometry] = useState<string>('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);

    const pickupMarkerRef = useRef<L.Marker>(null);
    const dropoffMarkerRef = useRef<L.Marker>(null);

    const center: [number, number] = [21.4225, 39.8262]; // Makkah center default

    // Memoize the Custom Icons
    const pickupIcon = useMemo(() => getPickupIcon(), []);
    const dropoffIcon = useMemo(() => getDropoffIcon(), []);

    // Reverse Geocoding via Nominatim API
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'AlAqsaUmrahTransportCustomRouteApp/2.0 (info@alaqsatransport.com)',
                    },
                }
            );
            
            if (!response.ok) throw new Error('Geocoding server error');
            const data = await response.json();
            
            // Format dynamic output with sensible names
            if (data && data.display_name) {
                // Strip unnecessary long parts of address
                const parts = data.display_name.split(', ');
                const shortAddress = parts.slice(0, 4).join(', ');
                return shortAddress || data.display_name;
            }
            return `Point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch (err) {
            console.error('Reverse Geocoding error:', err);
            return `Point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    };

    // Calculate OSRM Route polyline, distance, duration
    const calculateRoute = useCallback(async (
        pLat: number,
        pLng: number,
        dLat: number,
        dLng: number,
        pAddress: string,
        dAddress: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('OSRM routing service failed to respond.');
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error('Could not compute routing coordinates. Please pick valid roads.');
            }

            const route = data.routes[0];
            const dist = Number((route.distance / 1000).toFixed(1)); // Convert meters to km
            const dur = Math.ceil(route.duration / 60); // Convert seconds to minutes
            
            // Convert OSRM GeoJSON coords [lng, lat] into Leaflet [lat, lng] coordinates
            const coords: [number, number][] = route.geometry.coordinates.map(
                (c: [number, number]) => [c[1], c[0]] as [number, number]
            );

            setDistanceKm(dist);
            setDurationMin(dur);
            setRoutePolyline(coords);
            
            const geomStr = JSON.stringify(route.geometry);
            setGeometry(geomStr);

            // Report results
            onRouteCalculated({
                pickup: { lat: pLat, lng: pLng, address: pAddress },
                dropoff: { lat: dLat, lng: dLng, address: dAddress },
                distanceKm: dist,
                durationMin: dur,
                geometry: geomStr,
            });
        } catch (err: any) {
            console.error('OSRM Calculation error:', err);
            setError(err.message || 'Unable to load route driving coordinates between points.');
        } finally {
            setLoading(false);
        }
    }, [onRouteCalculated]);

    // Handle initial routing if both loaded
    useEffect(() => {
        if (initialPickup && initialDropoff && !pickup && !dropoff) {
            setPickup(initialPickup);
            setDropoff(initialDropoff);
            calculateRoute(
                initialPickup.lat,
                initialPickup.lng,
                initialDropoff.lat,
                initialDropoff.lng,
                initialPickup.address,
                initialDropoff.address
            );
        }
    }, [initialPickup, initialDropoff, pickup, dropoff, calculateRoute]);

    // Handle Map Clicks to set coordinates
    const handleMapClick = async (latlng: L.LatLng) => {
        setError(null);
        if (!pickup) {
            setLoading(true);
            const address = await reverseGeocode(latlng.lat, latlng.lng);
            const newPickup = { lat: latlng.lat, lng: latlng.lng, address };
            setPickup(newPickup);
            setLoading(false);
        } else if (!dropoff) {
            setLoading(true);
            const address = await reverseGeocode(latlng.lat, latlng.lng);
            const newDropoff = { lat: latlng.lat, lng: latlng.lng, address };
            setDropoff(newDropoff);
            
            // Triggers routing
            await calculateRoute(pickup.lat, pickup.lng, latlng.lat, latlng.lng, pickup.address, address);
        }
    };

    // Marker drag updates
    const handleMarkerDragEnd = async (type: 'pickup' | 'dropoff') => {
        setError(null);
        if (type === 'pickup' && pickupMarkerRef.current && pickup) {
            const marker = pickupMarkerRef.current;
            const newLatLng = marker.getLatLng();
            setLoading(true);
            const address = await reverseGeocode(newLatLng.lat, newLatLng.lng);
            const updatedPickup = { lat: newLatLng.lat, lng: newLatLng.lng, address };
            setPickup(updatedPickup);
            
            if (dropoff) {
                await calculateRoute(newLatLng.lat, newLatLng.lng, dropoff.lat, dropoff.lng, address, dropoff.address);
            } else {
                setLoading(false);
            }
        } else if (type === 'dropoff' && dropoffMarkerRef.current && dropoff && pickup) {
            const marker = dropoffMarkerRef.current;
            const newLatLng = marker.getLatLng();
            setLoading(true);
            const address = await reverseGeocode(newLatLng.lat, newLatLng.lng);
            const updatedDropoff = { lat: newLatLng.lat, lng: newLatLng.lng, address };
            setDropoff(updatedDropoff);
            
            await calculateRoute(pickup.lat, pickup.lng, newLatLng.lat, newLatLng.lng, pickup.address, address);
        }
    };

    // Reset Map selections
    const handleReset = () => {
        setPickup(null);
        setDropoff(null);
        setDistanceKm(null);
        setDurationMin(null);
        setRoutePolyline(null);
        setGeometry('');
        setError(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Map className="text-amber-500" size={18} />
                        Custom Location Mapper
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {!pickup ? 'Step 1: Click on the map to set your pickup location' : !dropoff ? 'Step 2: Click on the map to set your dropoff location' : 'Drag markers to adjust your route seamlessly'}
                    </p>
                </div>

                {(pickup || dropoff) && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all"
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        Reset Map Coordinates
                    </button>
                )}
            </div>

            {/* Instruction Banner or Errors */}
            {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl z-0 bg-slate-950">
                <MapContainer
                    center={center}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    whenReady={() => setMapReady(true)}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Premium Dark map style
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {mapReady && <MapEventsHandler onMapClick={handleMapClick} />}

                    {pickup && (
                        <Marker
                            position={[pickup.lat, pickup.lng]}
                            draggable={!loading}
                            icon={pickupIcon}
                            eventHandlers={{
                                dragend: () => handleMarkerDragEnd('pickup'),
                            }}
                            ref={pickupMarkerRef}
                        />
                    )}

                    {dropoff && (
                        <Marker
                            position={[dropoff.lat, dropoff.lng]}
                            draggable={!loading}
                            icon={dropoffIcon}
                            eventHandlers={{
                                dragend: () => handleMarkerDragEnd('dropoff'),
                            }}
                            ref={dropoffMarkerRef}
                        />
                    )}

                    {routePolyline && (
                        <Polyline
                            positions={routePolyline}
                            color="#D4AF37" // Beautiful Al Aqsa Gold Theme Color
                            weight={5}
                            opacity={0.85}
                            dashArray="1, 8"
                            lineCap="round"
                        />
                    )}

                    <MapBoundsManager pickup={pickup} dropoff={dropoff} routePolyline={routePolyline} />
                </MapContainer>

                {/* Floating Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="text-amber-500 animate-spin" />
                        <span className="text-sm font-semibold text-white">Recalculating custom route path...</span>
                    </div>
                )}
            </div>

            {/* Premium Routing Stats HUD */}
            {pickup && (
                <div className="grid md:grid-cols-2 gap-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-slate-200">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                                <span className="text-xs font-bold font-mono">A</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Pickup Point</span>
                                <span className="text-sm font-medium text-white block mt-0.5 leading-snug">
                                    {pickup.address}
                                </span>
                            </div>
                        </div>

                        {dropoff ? (
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
                                    <span className="text-xs font-bold font-mono">B</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Dropoff Point</span>
                                    <span className="text-sm font-medium text-white block mt-0.5 leading-snug">
                                        {dropoff.address}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950/20">
                                <div className="w-5 h-5 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-500 shrink-0 mt-0.5 animate-pulse">
                                    <span className="text-[10px] font-bold">B</span>
                                </div>
                                <span className="text-xs text-muted-foreground italic mt-0.5">
                                    Click anywhere on the dark map above to drop your red Dropoff marker.
                                </span>
                            </div>
                        )}
                    </div>

                    {distanceKm !== null && durationMin !== null && (
                        <div className="flex flex-col justify-center items-center md:items-end md:text-right gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
                            <div className="flex items-center gap-6">
                                <div className="text-center md:text-right">
                                    <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider">Estimated Distance</span>
                                    <span className="text-2xl font-black text-amber-500 font-mono mt-0.5 block">
                                        {distanceKm} <span className="text-sm font-medium text-slate-400">km</span>
                                    </span>
                                </div>

                                <div className="text-center md:text-right">
                                    <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider">Est. Duration</span>
                                    <span className="text-2xl font-black text-amber-500 font-mono mt-0.5 block">
                                        {durationMin} <span className="text-sm font-medium text-slate-400">mins</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                                <Navigation size={13} className="animate-pulse" />
                                Interactive OSRM Route Displayed
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
