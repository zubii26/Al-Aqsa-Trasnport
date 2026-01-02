
'use client';

import { useState, useEffect } from 'react';
import ChatWidget from '@/components/chat/ChatWidget';
import { Loader2 } from 'lucide-react';

export default function DriverChatPage() {
    const [driverId, setDriverId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch current driver ID
        const fetchMe = async () => {
            try {
                const res = await fetch('/api/auth/me'); // Assuming this endpoint works for drivers too
                const data = await res.json();
                if (data.user) {
                    setDriverId(data.user.id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMe();
    }, []);

    if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
    if (!driverId) return <div className="p-8 text-center text-red-500">Failed to load driver info</div>;

    const channelId = `chat_${driverId}`;

    return (
        <div className="space-y-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-slate-900">Dispatch Support</h1>
            <p className="text-slate-500 text-sm mb-4">Chat directly with the operations team.</p>

            <ChatWidget
                channelId={channelId}
                currentUserId={driverId}
                currentUserRole="driver"
                title="Admin Support"
            />
        </div>
    );
}
