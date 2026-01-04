
'use client';

import { useEffect } from 'react';

const PUBLIC_VAPID_KEY = 'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_85lboxZCXRCNknVKUDKnE3b-9htxvw';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

interface PWAInitProps {
    serviceWorkerUrl?: string;
    scope?: string;
}

export default function PWAInit(props: PWAInitProps) {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Register immediately since we are in useEffect (client-side)
            const swUrl = props.serviceWorkerUrl || '/sw.js';
            const scope = props.scope || undefined;

            navigator.serviceWorker.register(swUrl, { scope })
                .then((registration) => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    subscribeUser(registration);
                })
                .catch((err) => {
                    console.error('ServiceWorker registration failed: ', err);
                });
        }
    }, []);

    const subscribeUser = async (registration: ServiceWorkerRegistration) => {
        try {
            const sub = await registration.pushManager.getSubscription();
            if (sub) {
                console.log('User is already subscribed to push:', sub);
                // Optimally, we should sync this with backend just in case
                return;
            }

            console.log('Requesting notification permission...');
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                console.log('Notification permission denied');
                return;
            }

            const convertedVapidKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            console.log('User is subscribed:', subscription);

            // Send subscription to backend
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (err) {
            console.log('Failed to subscribe the user: ', err);
        }
    };

    return null;
}
