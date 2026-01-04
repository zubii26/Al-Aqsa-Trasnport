'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePushSubscription } from '@/hooks/usePushSubscription';

export default function NotificationControl() {
    const subscription = usePushSubscription();
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
    const [vapidMissing, setVapidMissing] = useState(false);

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
            setVapidMissing(true);
        }
    }, []);

    const testNotification = async () => {
        setIsTesting(true);
        setTestResult('idle');
        try {
            const res = await fetch('/api/notifications/test', { method: 'POST' });
            if (res.ok) {
                setTestResult('success');
            } else {
                setTestResult('error');
            }
        } catch (err) {
            setTestResult('error');
        } finally {
            setIsTesting(false);
            setTimeout(() => setTestResult('idle'), 3000);
        }
    };

    if (vapidMissing) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
                <AlertTriangle size={12} />
                VAPID Config Missing
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {subscription ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-500">
                        <Bell size={12} className="animate-bounce" />
                        Push Active
                    </div>
                    <button
                        onClick={testNotification}
                        disabled={isTesting}
                        className={`
                            p-2 rounded-full transition-all flex items-center justify-center relative
                            ${testResult === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                testResult === 'error' ? 'bg-red-100 text-red-600' :
                                    'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'}
                        `}
                        title="Send Test Notification"
                    >
                        {isTesting ? <Loader2 size={16} className="animate-spin" /> :
                            testResult === 'success' ? <CheckCircle2 size={16} /> :
                                testResult === 'error' ? <AlertTriangle size={16} /> :
                                    <Send size={16} />}
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    <BellOff size={12} />
                    Push Disabled
                </div>
            )}
        </div>
    );
}
