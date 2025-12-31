'use client';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import styles from './BookingCalendar.module.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Assuming Booking type matches what you have in parent component, or import it
interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: any; // Full booking object
}

interface BookingCalendarProps {
    events: CalendarEvent[];
    onSelectEvent: (event: CalendarEvent) => void;
}

export default function BookingCalendar({ events, onSelectEvent }: BookingCalendarProps) {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
        const newDate = new Date(date);
        if (action === 'TODAY') {
            setDate(new Date());
            return;
        }

        if (view === 'month') {
            if (action === 'PREV') newDate.setMonth(newDate.getMonth() - 1);
            else newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === 'week') {
            if (action === 'PREV') newDate.setDate(newDate.getDate() - 7);
            else newDate.setDate(newDate.getDate() + 7);
        } else {
            if (action === 'PREV') newDate.setDate(newDate.getDate() - 1);
            else newDate.setDate(newDate.getDate() + 1);
        }
        setDate(newDate);
    };

    const CustomToolbar = (toolbar: any) => {
        return (
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleNavigate('PREV')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                        onClick={() => handleNavigate('TODAY')}
                        className="px-4 py-1.5 text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => handleNavigate('NEXT')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <h3 className="text-xl font-bold ml-2 text-slate-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon size={20} className="text-amber-500" />
                        {format(date, 'MMMM yyyy')}
                    </h3>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {['month', 'week', 'day'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v as View)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${view === v
                                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-500 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`h-[700px] w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 ${styles.calendarWrapper}`}>
            <Calendar
                localizer={localizer}
                events={events} // Cast to any if needed due to strict types
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                date={date}
                view={view}
                onView={setView}
                onNavigate={setDate}
                components={{
                    toolbar: CustomToolbar
                }}
                onSelectEvent={onSelectEvent}
                eventPropGetter={(event: CalendarEvent) => {
                    let className = '';
                    const status = event.resource.status;

                    if (status === 'confirmed') className = '!bg-emerald-500 !border-emerald-600';
                    else if (status === 'pending') className = '!bg-amber-500 !border-amber-600';
                    else if (status === 'cancelled') className = '!bg-red-500 !border-red-600 !opacity-60';
                    else if (status === 'completed') className = '!bg-blue-500 !border-blue-600';

                    return { className };
                }}
            />
        </div>
    );
}
