'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Map, Loader2, AlertCircle, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

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

interface LocationPoint {
    lat: number;
    lng: number;
    address: string;
}

interface CustomRouteMapProps {
    onRouteCalculated: (data: {
        pickup: LocationPoint;
        dropoff: LocationPoint;
        distanceKm: number;
        durationMin: number;
        geometry: string;
    }) => void;
    initialPickup?: LocationPoint | null;
    initialDropoff?: LocationPoint | null;
}

// Auto Fit Map bounds to show route/markers dynamically
function MapBoundsManager({
    pickup,
    dropoff,
    routePolyline,
    mode
}: {
    pickup: LocationPoint | null;
    dropoff: LocationPoint | null;
    routePolyline: [number, number][] | null;
    mode: 'pickup' | 'dropoff' | 'route';
}) {
    const map = useMap();
    useEffect(() => {
        if (mode === 'route' && pickup && dropoff) {
            const bounds = L.latLngBounds([
                [pickup.lat, pickup.lng],
                [dropoff.lat, dropoff.lng],
            ]);
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 1 });
        } else if (mode === 'dropoff' && pickup) {
            // Center map on pickup when moving to dropoff step
            map.setView([pickup.lat, pickup.lng], 13, { animate: true });
        }
    }, [pickup, dropoff, routePolyline, mode, map]);
    return null;
}

// Interactive Map Size Invalidation Helper
function MapResizeTrigger() {
    const map = useMap();
    useEffect(() => {
        const timers = [
            setTimeout(() => map.invalidateSize({ animate: true }), 100),
            setTimeout(() => map.invalidateSize({ animate: true }), 300),
            setTimeout(() => map.invalidateSize({ animate: true }), 600),
            setTimeout(() => map.invalidateSize({ animate: true }), 1000),
            setTimeout(() => map.invalidateSize({ animate: true }), 2000),
        ];

        const handleResize = () => {
            map.invalidateSize();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [map]);
    return null;
}

export default function CustomRouteMap({
    onRouteCalculated,
    initialPickup = null,
    initialDropoff = null,
}: CustomRouteMapProps) {
    const [mode, setMode] = useState<'pickup' | 'dropoff' | 'route'>('pickup');
    
    const [pickup, setPickup] = useState<LocationPoint | null>(initialPickup);
    const [dropoff, setDropoff] = useState<LocationPoint | null>(initialDropoff);
    
    const [tempCenterAddress, setTempCenterAddress] = useState<string>('Locating...');
    const [isMoving, setIsMoving] = useState(false);
    
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [durationMin, setDurationMin] = useState<number | null>(null);
    const [routePolyline, setRoutePolyline] = useState<[number, number][] | null>(null);
    const [geometry, setGeometry] = useState<string>('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Initial center is Saudi Arabia
    const defaultCenter: [number, number] = [23.8859, 45.0792];
    const currentCenterRef = useRef<L.LatLng>(L.latLng(defaultCenter[0], defaultCenter[1]));
    const abortControllerRef = useRef<AbortController | null>(null);

    const pickupIcon = useMemo(() => getPickupIcon(), []);
    const dropoffIcon = useMemo(() => getDropoffIcon(), []);

    // Reverse Geocoding via Nominatim API
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        // Cancel pending geocodes to avoid race conditions
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'AlAqsaUmrahTransportCustomRouteApp/3.0 (info@alaqsatransport.com)',
                    },
                    signal: abortControllerRef.current.signal
                }
            );
            
            if (!response.ok) throw new Error('Geocoding error');
            const data = await response.json();
            
            if (data && data.display_name) {
                const parts = data.display_name.split(', ');
                const shortAddress = parts.slice(0, 4).join(', ');
                return shortAddress || data.display_name;
            }
            return `Point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch (err: any) {
            if (err.name === 'AbortError') return '';
            console.error('Reverse Geocoding error:', err);
            return `Point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    };

    // Calculate OSRM Route
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
            
            if (!response.ok) throw new Error('Routing service failed.');
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error('Could not compute valid roads between points.');
            }

            const route = data.routes[0];
            const dist = Number((route.distance / 1000).toFixed(1)); 
            const dur = Math.ceil(route.duration / 60); 
            
            const coords: [number, number][] = route.geometry.coordinates.map(
                (c: [number, number]) => [c[1], c[0]] as [number, number]
            );

            setDistanceKm(dist);
            setDurationMin(dur);
            setRoutePolyline(coords);
            setGeometry(JSON.stringify(route.geometry));

            onRouteCalculated({
                pickup: { lat: pLat, lng: pLng, address: pAddress },
                dropoff: { lat: dLat, lng: dLng, address: dAddress },
                distanceKm: dist,
                durationMin: dur,
                geometry: JSON.stringify(route.geometry),
            });
            
            setMode('route');
        } catch (err: any) {
            console.error('OSRM error:', err);
            setError(err.message || 'Unable to load route.');
        } finally {
            setLoading(false);
        }
    }, [onRouteCalculated]);

    // Handle initial routing if both loaded
    useEffect(() => {
        if (initialPickup && initialDropoff && !pickup && !dropoff) {
            setPickup(initialPickup);
            setDropoff(initialDropoff);
            setMode('route');
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

    // Uber-style Map Movement Handler
    function MapMovementHandler() {
        const map = useMapEvents({
            movestart() {
                if (mode !== 'route') {
                    setIsMoving(true);
                    setTempCenterAddress('Locating...');
                }
            },
            moveend() {
                if (mode !== 'route') {
                    setIsMoving(false);
                    const center = map.getCenter();
                    currentCenterRef.current = center;
                    // Trigger reverse geocoding
                    reverseGeocode(center.lat, center.lng).then(address => {
                        if (address && !isMoving && currentCenterRef.current.lat === center.lat) {
                            setTempCenterAddress(address);
                        }
                    });
                }
            },
        });
        
        // Initial Geocode on mount for pickup
        useEffect(() => {
            if (mapReady && mode === 'pickup' && !pickup && tempCenterAddress === 'Locating...') {
                const center = map.getCenter();
                currentCenterRef.current = center;
                reverseGeocode(center.lat, center.lng).then(address => {
                    if (address) setTempCenterAddress(address);
                });
            }
        }, [mapReady, mode, pickup, tempCenterAddress, map]);
        
        return null;
    }

    const handleConfirmLocation = () => {
        const center = currentCenterRef.current;
        if (mode === 'pickup') {
            setPickup({
                lat: center.lat,
                lng: center.lng,
                address: tempCenterAddress
            });
            setMode('dropoff');
            setTempCenterAddress('Locating...');
            // Geocode immediately at new map center to avoid empty states
            reverseGeocode(center.lat, center.lng).then(address => {
                if (address) setTempCenterAddress(address);
            });
        } else if (mode === 'dropoff' && pickup) {
            const newDropoff = {
                lat: center.lat,
                lng: center.lng,
                address: tempCenterAddress
            };
            setDropoff(newDropoff);
            calculateRoute(pickup.lat, pickup.lng, newDropoff.lat, newDropoff.lng, pickup.address, newDropoff.address);
        }
    };

    const handleReset = () => {
        setPickup(null);
        setDropoff(null);
        setDistanceKm(null);
        setDurationMin(null);
        setRoutePolyline(null);
        setGeometry('');
        setError(null);
        setMode('pickup');
    };
    
    const handleBack = () => {
        if (mode === 'dropoff') {
            setMode('pickup');
            setDropoff(null);
            if (pickup) {
                setTempCenterAddress(pickup.address);
                currentCenterRef.current = L.latLng(pickup.lat, pickup.lng);
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Top Bar / Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    {mode === 'dropoff' && (
                        <button 
                            onClick={handleBack}
                            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                    )}
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            {mode === 'pickup' && <><MapPin className="text-emerald-500" size={18} /> Step 1: Choose Pickup</>}
                            {mode === 'dropoff' && <><MapPin className="text-rose-500" size={18} /> Step 2: Choose Dropoff</>}
                            {mode === 'route' && <><Navigation className="text-amber-500" size={18} /> Route Summary</>}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {mode !== 'route' ? 'Drag the map to set the exact location' : 'Review your route details'}
                        </p>
                    </div>
                </div>

                {mode === 'route' && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
                    >
                        <RefreshCw size={13} />
                        Change Route
                    </button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="relative h-[550px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-0 bg-slate-950 flex flex-col">
                <MapContainer
                    center={defaultCenter}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    whenReady={() => setMapReady(true)}
                    zoomControl={false}
                >
                    <MapResizeTrigger />
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    />

                    {mapReady && <MapMovementHandler />}

                    {/* Fixed Markers for selected points (Not Center Pin) */}
                    {mode !== 'pickup' && pickup && (
                        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon!} />
                    )}
                    {mode === 'route' && dropoff && (
                        <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon!} />
                    )}

                    {routePolyline && (
                        <Polyline
                            positions={routePolyline}
                            color="#3b82f6" // Beautiful Blue line as requested for Uber style
                            weight={4}
                            opacity={0.9}
                            lineCap="round"
                            lineJoin="round"
                        />
                    )}

                    <MapBoundsManager pickup={pickup} dropoff={dropoff} routePolyline={routePolyline} mode={mode} />
                </MapContainer>

                {/* Fixed Center Pin Overlay for Pickup/Dropoff Modes */}
                {mode !== 'route' && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[1000] pb-16">
                        <div className={`flex flex-col items-center justify-end h-16 w-16 -translate-y-8 transition-transform duration-300 ease-out ${isMoving ? '-translate-y-12' : ''}`}>
                            <div className={`transform transition-transform duration-300 ${isMoving ? 'scale-105' : 'scale-100'}`}>
                                {mode === 'pickup' ? (
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 border-[3px] border-white flex items-center justify-center shadow-xl">
                                            <div className="w-3 h-3 rounded-full bg-white shadow-inner"></div>
                                        </div>
                                        <div className="w-1 h-3 bg-slate-900 rounded-b-full shadow-lg"></div>
                                    </div>
                                ) : (
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 border-[3px] border-white flex items-center justify-center shadow-xl">
                                            <div className="w-3 h-3 rounded-full bg-white shadow-inner"></div>
                                        </div>
                                        <div className="w-1 h-3 bg-slate-900 rounded-b-full shadow-lg"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Shadow underneath */}
                        <div className={`w-4 h-1.5 bg-black/40 rounded-full blur-[2px] transition-all duration-300 ${isMoving ? 'scale-50 opacity-20' : 'scale-100 opacity-60'}`}></div>
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-[2000] flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="text-amber-500 animate-spin" />
                        <span className="text-sm font-semibold text-white">Routing...</span>
                    </div>
                )}

                {/* Bottom Sheet HUD (Uber Style) */}
                {mode !== 'route' && (
                    <div className={`absolute bottom-0 left-0 right-0 z-[1500] p-4 transition-transform duration-500 ease-out`}>
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-3xl p-5 w-full mx-auto max-w-lg">
                            <div className="flex items-start gap-4 mb-5">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mode === 'pickup' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                                    {mode === 'pickup' ? (
                                        <MapPin className="text-emerald-500" size={20} />
                                    ) : (
                                        <MapPin className="text-rose-500" size={20} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                        {mode === 'pickup' ? 'Pickup Location' : 'Dropoff Location'}
                                    </span>
                                    <h4 className="text-white font-medium text-lg leading-snug truncate">
                                        {isMoving ? 'Locating...' : tempCenterAddress}
                                    </h4>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmLocation}
                                disabled={isMoving || tempCenterAddress === 'Locating...'}
                                className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 shadow-lg
                                    ${isMoving || tempCenterAddress === 'Locating...' ? 'bg-slate-700 opacity-50 cursor-not-allowed' : mode === 'pickup' ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-900/50' : 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-900/50'}`}
                            >
                                {mode === 'pickup' ? 'Confirm Pickup' : 'Confirm Dropoff'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats HUD (Visible only when Route is active) */}
                {mode === 'route' && distanceKm !== null && durationMin !== null && (
                    <div className="absolute bottom-4 left-4 right-4 z-[1500]">
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl rounded-3xl p-5 flex items-center justify-between mx-auto max-w-lg">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-amber-500/80 uppercase tracking-wider">Distance</span>
                                <div className="text-2xl font-black text-white">{distanceKm} <span className="text-sm font-medium text-slate-400">km</span></div>
                            </div>
                            <div className="h-10 w-px bg-slate-700"></div>
                            <div className="space-y-1 text-right">
                                <span className="text-xs font-semibold text-amber-500/80 uppercase tracking-wider">Est. Time</span>
                                <div className="text-2xl font-black text-white">{durationMin} <span className="text-sm font-medium text-slate-400">min</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
