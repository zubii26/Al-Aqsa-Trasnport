
import Pusher from 'pusher';

const pusherConfig = {
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
};

// Safe initialization
export const pusherServer = (pusherConfig.appId && pusherConfig.key && pusherConfig.secret && pusherConfig.cluster)
    ? new Pusher(pusherConfig)
    : {
        trigger: async (...args: any[]) => {
            console.warn('[Pusher] Trigger skipped: Missing environment variables');
            return null;
        }
    } as unknown as Pusher;
