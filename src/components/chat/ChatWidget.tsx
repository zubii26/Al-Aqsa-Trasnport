
'use client';

import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
    _id: string;
    senderId: string;
    senderRole: string;
    content: string;
    createdAt: string;
}

interface ChatWidgetProps {
    channelId: string;
    currentUserId: string;
    currentUserRole: 'admin' | 'driver' | 'user';
    title?: string;
}

export default function ChatWidget({ channelId, currentUserId, currentUserRole, title }: ChatWidgetProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/chat/history?channelId=${channelId}`);
                const data = await res.json();
                setMessages(data.messages || []);
            } catch (err) {
                console.error('Failed to load chat history', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [channelId]);

    // Pusher Subscription
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(channelId);

        channel.bind('new-message', (data: Message) => {
            setMessages((prev) => {
                // Prevent duplicate messages if sender is self (handled by optimistic UI or server response integration)
                // For simplicity, we just append if ID is new
                if (prev.some(m => m._id === data._id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            pusher.unsubscribe(channelId);
        };
    }, [channelId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelId,
                    content: newMessage,
                    // receiverId is implicit in channel logic for now or needs to be passed
                })
            });
            const data = await res.json();
            if (data.success) {
                setNewMessage('');
                // Optimistically add? Or wait for Pusher?
                // Pusher is faster for consistency, but we can do both.
                // Let's rely on Pusher slightly, or append manually to be snappy.
                setMessages(prev => [...prev, { ...data.message, _id: data.message._id }]);
            }
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 px-4 py-3 text-white font-medium flex justify-between items-center">
                <span>{title || 'Chat'}</span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Live</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-slate-400" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm py-8">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                    max-w-[70%] rounded-2xl px-4 py-2 text-sm
                                    ${isMe
                                        ? 'bg-amber-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                                    }
                                `}>
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-amber-200' : 'text-slate-400'}`}>
                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </form>
        </div>
    );
}
