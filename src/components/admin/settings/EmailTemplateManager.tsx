'use client';

import { useState } from 'react';
import { Settings } from '@/lib/validations'; // Your settings type
import { Save, Info } from 'lucide-react';

interface EmailTemplateManagerProps {
    settings: Settings;
    onChange: (key: 'emailTemplates', value: any) => void;
}

export default function EmailTemplateManager({ settings, onChange }: EmailTemplateManagerProps) {
    const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

    // Local state for editing to prevent lag on every keystroke if parent state is heavy
    const [bookingTemplate, setBookingTemplate] = useState(settings.emailTemplates?.bookingConfirmation || '');
    const [adminTemplate, setAdminTemplate] = useState(settings.emailTemplates?.adminNotification || '');

    const handleBlur = () => {
        onChange('emailTemplates', {
            bookingConfirmation: bookingTemplate,
            adminNotification: adminTemplate
        });
    };

    const variables = [
        '{{name}}', '{{booking_id}}', '{{date}}', '{{time}}',
        '{{pickup}}', '{{dropoff}}', '{{vehicle_details}}',
        '{{passengers}}', '{{price_row}}', '{{status}}'
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-1">
                <button
                    onClick={() => setActiveTab('customer')}
                    className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'customer'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Customer Confirmation
                </button>
                <button
                    onClick={() => setActiveTab('admin')}
                    className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'admin'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Admin Notification
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                        HTML Content
                    </label>
                    <textarea
                        value={activeTab === 'customer' ? bookingTemplate : adminTemplate}
                        onChange={(e) => {
                            if (activeTab === 'customer') setBookingTemplate(e.target.value);
                            else setAdminTemplate(e.target.value);
                        }}
                        onBlur={handleBlur}
                        className="w-full h-[500px] p-4 font-mono text-sm bg-muted/30 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        Supports basic HTML styling.
                    </p>
                </div>

                <div>
                    <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-3">
                            <Info size={16} className="text-primary" />
                            Available Variables
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3">
                            Click to copy variable to clipboard
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {variables.map(variable => (
                                <button
                                    key={variable}
                                    onClick={() => {
                                        navigator.clipboard.writeText(variable);
                                    }}
                                    className="px-2 py-1 bg-background border border-input rounded text-xs font-mono hover:border-primary/50 transition-colors"
                                >
                                    {variable}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-500 mb-2">Tips</h4>
                        <ul className="text-xs text-amber-600/90 dark:text-amber-500/80 space-y-1 list-disc pl-4">
                            <li>Use inline CSS for styling (e.g., style="color: red;")</li>
                            <li>Images must be hosted publicly (use full URLs)</li>
                            <li>{`{{ vehicle_details }}`} renders a list or single name automatically</li>
                            <li>{`{{ price_row }}`} renders the entire total price row if price exists</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
