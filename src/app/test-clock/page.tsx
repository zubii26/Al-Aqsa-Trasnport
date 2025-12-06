'use client';

import React, { useState } from 'react';
import ClockTimePicker from '@/components/ui/TimePicker/ClockTimePicker';

export default function TestClockPage() {
    const [time, setTime] = useState<Date>(new Date());

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-8">
            <h1 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">Clock Time Picker Test</h1>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <ClockTimePicker
                    date={time}
                    onChange={setTime}
                    className="border border-slate-300 dark:border-slate-600 rounded p-2"
                />
            </div>
            <div className="mt-8 text-lg text-slate-600 dark:text-slate-300">
                Selected Time: {time.toLocaleTimeString()}
            </div>
        </div>
    );
}
