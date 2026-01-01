'use client';

import { useEffect, useRef } from 'react';

interface LocationTrackerProps {
    isOnline: boolean;
}

export default function LocationTracker({ isOnline }: LocationTrackerProps) {
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isOnline) {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        if (!('geolocation' in navigator)) {
            console.error('Geolocation not supported');
            return;
        }

        const updateLocation = async (position: GeolocationPosition) => {
            try {
                const { latitude, longitude, heading } = position.coords;

                await fetch('/api/driver/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lat: latitude,
                        lng: longitude,
                        heading: heading || 0
                    })
                });
            } catch (error) {
                console.error('Failed to update location:', error);
            }
        };

        // Watch position updates
        watchIdRef.current = navigator.geolocation.watchPosition(
            updateLocation,
            (error) => console.error('Location error:', error),
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 10000
            }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [isOnline]);

    return null; // Invisible component
}
