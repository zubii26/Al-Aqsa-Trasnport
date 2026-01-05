'use client';

import { useEffect, useState } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
    try {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    } catch (e) {
        console.error('Failed to convert VAPID key:', e);
        return new Uint8Array(0);
    }
}

export function usePushSubscription() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if (!VAPID_PUBLIC_KEY) {
            console.warn('VAPID Public Key not found. Push notifications disabled.');
            return;
        }

        if ('serviceWorker' in navigator && 'PushManager' in window && VAPID_PUBLIC_KEY) {
            // Wait for Service Worker
            navigator.serviceWorker.ready.then(async (registration) => {
                try {
                    const sub = await registration.pushManager.getSubscription();
                    if (sub) {
                        setSubscription(sub);
                        // Optional: Resend to server to ensure it's fresh
                        await saveSubscription(sub);
                    } else {
                        // Ask for permission and subscribe
                        const permission = await Notification.requestPermission();
                        if (permission === 'granted') {
                            const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
                            // Avoid subscribing with empty key if conversion failed
                            if (convertedKey.length === 0) return;

                            const newSub = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: convertedKey
                            });
                            setSubscription(newSub);
                            await saveSubscription(newSub);
                        }
                    }
                } catch (error) {
                    console.error('Failed to subscribe to push:', error);
                }
            });
        }
    }, []);

    const saveSubscription = async (sub: PushSubscription) => {
        try {
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription: sub }),
            });
        } catch (err) {
            console.error('Failed to save subscription on server', err);
        }
    };

    return subscription;
}
