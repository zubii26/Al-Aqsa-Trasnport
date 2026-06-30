'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2, AlertCircle, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

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

export default function CustomRouteMap({
    onRouteCalculated,
    initialPickup = null,
    initialDropoff = null,
}: CustomRouteMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const routeLayerRef = useRef<any>(null);
    const pickupMarkerRef = useRef<any>(null);
    const dropoffMarkerRef = useRef<any>(null);
    
    const [mode, setMode] = useState<'pickup' | 'dropoff' | 'route'>('pickup');
    
    const [pickup, setPickup] = useState<LocationPoint | null>(initialPickup);
    const [dropoff, setDropoff] = useState<LocationPoint | null>(initialDropoff);
    
    const [tempCenterAddress, setTempCenterAddress] = useState<string>('Locating...');
    const [isMoving, setIsMoving] = useState(false);
    
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [durationMin, setDurationMin] = useState<number | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultCenter: [number, number] = [23.8859, 45.0792];
    const abortControllerRef = useRef<AbortController | null>(null);
    const centerRef = useRef<{lat: number, lng: number}>({ lat: defaultCenter[0], lng: defaultCenter[1] });

    // Ensure Leaflet is loaded
    const getL = async () => {
        if (typeof window === 'undefined') return null;
        const L = (await import('leaflet')).default;
        
        // Fix default icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        return L;
    };

    const getCustomIcon = (L: any, type: 'pickup' | 'dropoff') => {
        const isPickup = type === 'pickup';
        return L.divIcon({
            className: `custom-marker-${type}`,
            html: `
                <div class="relative flex items-center justify-center">
                    <div class="absolute w-8 h-8 rounded-full ${isPickup ? 'bg-emerald-500/30' : 'bg-rose-500/30'} animate-ping"></div>
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr ${isPickup ? 'from-emerald-600 to-teal-400' : 'from-rose-600 to-red-400'} border-2 border-slate-900 flex items-center justify-center shadow-lg relative z-10">
                        <span class="w-3.5 h-3.5 rounded-full bg-white shadow-inner flex items-center justify-center">
                            <span class="w-1.5 h-1.5 rounded-full ${isPickup ? 'bg-emerald-600' : 'bg-rose-600'}"></span>
                        </span>
                    </div>
                    <div class="absolute -bottom-1 w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    };

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: { 'User-Agent': 'AlAqsaUmrahTransport/3.0 (info@alaqsaumrahtransport.com)' },
                    signal: abortControllerRef.current.signal
                }
            );
            
            if (!response.ok) throw new Error('Geocoding error');
            const data = await response.json();
            
            if (data && data.display_name) {
                const parts = data.display_name.split(', ');
                return parts.slice(0, 4).join(', ') || data.display_name;
            }
            return `Point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch (err: any) {
            if (err.name === 'AbortError') return '';
            console.error('Reverse Geocoding error:', err);
            return `Point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    };

    const calculateRoute = useCallback(async (pLat: number, pLng: number, dLat: number, dLng: number, pAddress: string, dAddress: string) => {
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
            
            setDistanceKm(dist);
            setDurationMin(dur);
            
            // Draw Route exactly as requested
            const L = await getL();
            if (L && mapInstance.current) {
                if (routeLayerRef.current) {
                    mapInstance.current.removeLayer(routeLayerRef.current);
                }
                
                routeLayerRef.current = L.geoJSON(route.geometry, {
                    style: {
                        color: '#007AFF', // Exact color requested
                        weight: 5,
                        opacity: 0.9,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }
                }).addTo(mapInstance.current);
                
                // Fit bounds to route
                mapInstance.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] });
            }

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

    // Initialize Map
    useEffect(() => {
        let isMounted = true;
        
        const initMap = async () => {
            const L = await getL();
            if (!L || !mapRef.current || mapInstance.current) return;

            const map = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false,
            }).setView(defaultCenter, 5);
            
            mapInstance.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
                maxZoom: 19
            }).addTo(map);

            // Handle invalidation exactly as requested
            const triggerResize = () => {
                if (mapInstance.current) mapInstance.current.invalidateSize();
            };
            
            setTimeout(triggerResize, 100);
            setTimeout(triggerResize, 300);
            setTimeout(triggerResize, 600);
            window.addEventListener('resize', triggerResize);

            // Setup events
            map.on('movestart', () => {
                setIsMoving(true);
                setTempCenterAddress('Locating...');
            });

            map.on('moveend', async () => {
                setIsMoving(false);
                const center = map.getCenter();
                centerRef.current = { lat: center.lat, lng: center.lng };
                
                const address = await reverseGeocode(center.lat, center.lng);
                if (isMounted && address) {
                    setTempCenterAddress(address);
                }
            });

            // Initial geocode
            const initialAddress = await reverseGeocode(defaultCenter[0], defaultCenter[1]);
            if (isMounted && initialAddress) {
                setTempCenterAddress(initialAddress);
            }
        };

        initMap();

        return () => {
            isMounted = false;
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Watch for mode changes to handle fixed markers
    useEffect(() => {
        const updateMarkers = async () => {
            const L = await getL();
            if (!L || !mapInstance.current) return;
            const map = mapInstance.current;

            if (pickupMarkerRef.current) { map.removeLayer(pickupMarkerRef.current); pickupMarkerRef.current = null; }
            if (dropoffMarkerRef.current) { map.removeLayer(dropoffMarkerRef.current); dropoffMarkerRef.current = null; }

            if (mode !== 'pickup' && pickup) {
                pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: getCustomIcon(L, 'pickup') }).addTo(map);
            }
            if (mode === 'route' && dropoff) {
                dropoffMarkerRef.current = L.marker([dropoff.lat, dropoff.lng], { icon: getCustomIcon(L, 'dropoff') }).addTo(map);
            }
        };
        updateMarkers();
    }, [mode, pickup, dropoff]);

    const handleConfirmLocation = async () => {
        const center = centerRef.current;
        if (mode === 'pickup') {
            setPickup({ lat: center.lat, lng: center.lng, address: tempCenterAddress });
            setMode('dropoff');
            setTempCenterAddress('Locating...');
            
            if (mapInstance.current) {
                const L = await getL();
                if (L && routeLayerRef.current) {
                    mapInstance.current.removeLayer(routeLayerRef.current);
                    routeLayerRef.current = null;
                }
                mapInstance.current.setView([center.lat, center.lng], 13);
            }
            
            const address = await reverseGeocode(center.lat, center.lng);
            if (address) setTempCenterAddress(address);
            
        } else if (mode === 'dropoff' && pickup) {
            const newDropoff = { lat: center.lat, lng: center.lng, address: tempCenterAddress };
            setDropoff(newDropoff);
            calculateRoute(pickup.lat, pickup.lng, newDropoff.lat, newDropoff.lng, pickup.address, newDropoff.address);
        }
    };

    const handleReset = async () => {
        setPickup(null);
        setDropoff(null);
        setDistanceKm(null);
        setDurationMin(null);
        setError(null);
        setMode('pickup');
        
        if (mapInstance.current) {
            if (routeLayerRef.current) mapInstance.current.removeLayer(routeLayerRef.current);
            mapInstance.current.setView(defaultCenter, 5);
        }
    };
    
    const handleBack = () => {
        if (mode === 'dropoff') {
            setMode('pickup');
            setDropoff(null);
            if (pickup) {
                setTempCenterAddress(pickup.address);
                if (mapInstance.current) mapInstance.current.setView([pickup.lat, pickup.lng], 13);
                centerRef.current = { lat: pickup.lat, lng: pickup.lng };
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    {mode === 'dropoff' && (
                        <button onClick={handleBack} className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300">
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
                    <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700">
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

            {/* MAP CONTAINER MUST HAVE EXPLICIT HEIGHT OR WILL BE BLANK */}
            <div className="relative h-[65vh] min-h-[500px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-0 bg-[#e5e7eb] flex flex-col">
                <div ref={mapRef} className="absolute inset-0 z-0" />

                {/* Fixed Center Pin Overlay for Pickup/Dropoff Modes */}
                {mode !== 'route' && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[1000] pb-16">
                        <div className={`flex flex-col items-center justify-end h-16 w-16 -translate-y-8 transition-transform duration-300 ease-out ${isMoving ? '-translate-y-12' : ''}`}>
                            <div className={`transform transition-transform duration-300 ${isMoving ? 'scale-105' : 'scale-100'}`}>
                                <div className="relative flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center shadow-xl ${mode === 'pickup' ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400' : 'bg-gradient-to-tr from-rose-600 to-rose-400'}`}>
                                        <div className="w-3 h-3 rounded-full bg-white shadow-inner"></div>
                                    </div>
                                    <div className="w-1 h-3 bg-slate-900 rounded-b-full shadow-lg"></div>
                                </div>
                            </div>
                        </div>
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
                    <div className="absolute bottom-0 left-0 right-0 z-[1500] p-4 transition-transform duration-500 ease-out">
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-3xl p-5 w-full mx-auto max-w-lg">
                            <div className="flex items-start gap-4 mb-5">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mode === 'pickup' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                                    <MapPin className={mode === 'pickup' ? 'text-emerald-500' : 'text-rose-500'} size={20} />
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
                                    ${isMoving || tempCenterAddress === 'Locating...' ? 'bg-slate-700 opacity-50 cursor-not-allowed' : mode === 'pickup' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/50'}`}
                            >
                                {mode === 'pickup' ? 'Confirm Pickup' : 'Confirm Dropoff'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Route Stats HUD */}
                {mode === 'route' && distanceKm !== null && durationMin !== null && (
                    <div className="absolute bottom-4 left-4 right-4 z-[1500]">
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 shadow-2xl rounded-3xl p-5 flex items-center justify-between mx-auto max-w-lg">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Distance</span>
                                <div className="text-2xl font-black text-white">{distanceKm} <span className="text-sm font-medium text-slate-400">km</span></div>
                            </div>
                            <div className="h-10 w-px bg-slate-700"></div>
                            <div className="space-y-1 text-right">
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Est. Time</span>
                                <div className="text-2xl font-black text-white">{durationMin} <span className="text-sm font-medium text-slate-400">min</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
