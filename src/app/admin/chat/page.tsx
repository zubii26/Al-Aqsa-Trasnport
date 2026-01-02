
'use client';

import { useState, useEffect } from 'react';
import ChatWidget from '@/components/chat/ChatWidget';
import { Loader2, Search, User } from 'lucide-react';

export default function AdminChatPage() {
    const [adminId, setAdminId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [selectedDriverName, setSelectedDriverName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // Get Admin ID
                const authRes = await fetch('/api/auth/me');
                const authData = await authRes.json();
                setAdminId(authData.user?.id);

                // Fetch Active Channels (Drivers)
                // In a real app we need a dedicated endpoint. 
                // For MVP, we can fetch all drivers and filter or just list them.
                // Or clearer: Fetch messages, group by channelId.
                const channelsRes = await fetch('/api/chat/channels');
                const channelsData = await channelsRes.json();
                setConversations(channelsData.channels || []);

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Sidebar List */}
            <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-800 mb-2">Conversations</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search driver..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">No active chats</div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.channelId}
                                onClick={() => {
                                    setSelectedChannel(conv.channelId);
                                    setSelectedDriverName(conv.members[0]?.name || 'Unknown Driver');
                                }}
                                className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition flex items-center gap-3
                                    ${selectedChannel === conv.channelId ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''}
                                `}
                            >
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">{conv.members[0]?.name || 'Driver'}</h3>
                                    <p className="text-xs text-slate-500 truncate w-40">
                                        Last active: {new Date(conv.lastMessageAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1">
                {selectedChannel && adminId ? (
                    <ChatWidget
                        key={selectedChannel} // Force re-mount on change
                        channelId={selectedChannel}
                        currentUserId={adminId}
                        currentUserRole="admin"
                        title={selectedDriverName}
                    />
                ) : (
                    <div className="h-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
