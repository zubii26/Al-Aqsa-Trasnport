import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

export const usePusher = () => {
    const [pusher, setPusher] = useState<Pusher | null>(null);

    useEffect(() => {
        if (!PUSHER_KEY) {
            console.error('Pusher Key missing in env');
            return;
        }

        const pusherInstance = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
        });

        setPusher(pusherInstance);

        return () => {
            pusherInstance.disconnect();
        };
    }, []);

    return pusher;
};
