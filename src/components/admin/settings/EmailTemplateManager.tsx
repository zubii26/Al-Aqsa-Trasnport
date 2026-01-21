import { useState } from 'react';
import { Settings } from '@/lib/validations'; // Your settings type
import { Save, Info, Eye, X, RefreshCw } from 'lucide-react';

interface EmailTemplateManagerProps {
    settings: Settings;
    onChange: (key: 'emailTemplates', value: any) => void;
}

import { DEFAULT_BOOKING_CONFIRMATION_TEMPLATE, DEFAULT_ADMIN_NOTIFICATION_TEMPLATE } from '@/lib/email-templates';

export default function EmailTemplateManager({ settings, onChange }: EmailTemplateManagerProps) {
    const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
    const [previewOpen, setPreviewOpen] = useState(false);

    // Local state for editing to prevent lag on every keystroke if parent state is heavy
    const [bookingTemplate, setBookingTemplate] = useState(settings.emailTemplates?.bookingConfirmation || DEFAULT_BOOKING_CONFIRMATION_TEMPLATE);
    const [adminTemplate, setAdminTemplate] = useState(settings.emailTemplates?.adminNotification || DEFAULT_ADMIN_NOTIFICATION_TEMPLATE);

    const handleBlur = () => {
        onChange('emailTemplates', {
            bookingConfirmation: bookingTemplate,
            adminNotification: adminTemplate
        });
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset this template to the default version? Any custom changes will be lost.')) {
            if (activeTab === 'customer') {
                setBookingTemplate(DEFAULT_BOOKING_CONFIRMATION_TEMPLATE);
                // Trigger save immediately or let blur handle it? Better to trigger update to parent
                onChange('emailTemplates', {
                    bookingConfirmation: DEFAULT_BOOKING_CONFIRMATION_TEMPLATE,
                    adminNotification: adminTemplate
                });
            } else {
                setAdminTemplate(DEFAULT_ADMIN_NOTIFICATION_TEMPLATE);
                onChange('emailTemplates', {
                    bookingConfirmation: bookingTemplate,
                    adminNotification: DEFAULT_ADMIN_NOTIFICATION_TEMPLATE
                });
            }
        }
    };

    const variables = [
        '{{name}}', '{{booking_id}}', '{{date}}', '{{time}}',
        '{{pickup}}', '{{dropoff}}', '{{vehicle_details}}',
        '{{passengers}}', '{{price_row}}', '{{status}}'
    ];

    const getPreviewHtml = (template: string) => {
        let html = template;
        const dummyData: Record<string, string> = {
            '{{name}}': 'Abdullah Al-Saudi',
            '{{booking_id}}': 'BK-2025-8899',
            '{{date}}': '2025-01-15',
            '{{time}}': '14:30',
            '{{pickup}}': 'Jeddah International Airport (Terminal 1)',
            '{{dropoff}}': 'Pullman ZamZam Makkah',
            '{{vehicle_details}}': '<ul style="margin: 0; padding-left: 20px;"><li>1 x GMC Yukon XL (2024 Model)</li></ul>',
            '{{passengers}}': '4',
            '{{status}}': 'Confirmed',
            '{{price_row}}': `
                <tr>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #eee; width: 40%; color: #666;">
                        <div style="font-size: 12px; text-transform: uppercase;">Total Price</div>
                        <div style="font-family: 'Amiri', serif; font-size: 12px;">السعر الإجمالي</div>
                    </td>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-weight: bold; color: #d4af37; font-size: 18px;">
                        450 SAR
                    </td>
                </tr>
            `
        };

        // Replace all variables
        Object.keys(dummyData).forEach(key => {
            html = html.replace(new RegExp(key, 'g'), dummyData[key]);
        });

        // Also clean up any conditional blocks if you have them (advanced)
        // For now, simple replacement
        return html;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-1">
                <div className="flex items-center gap-4">
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
                <button
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-sm font-medium transition-colors"
                >
                    <Eye size={16} />
                    Preview
                </button>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-200"
                    title="Reset to default template"
                >
                    <RefreshCw size={16} />
                    Reset
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

            {/* Preview Modal */}
            {previewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Eye size={20} className="text-secondary" />
                                Email Preview ({activeTab === 'customer' ? 'Customer' : 'Admin'})
                            </h3>
                            <button
                                onClick={() => setPreviewOpen(false)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-8 bg-slate-100 dark:bg-slate-950">
                            <div className="max-w-[600px] mx-auto bg-white shadow-sm min-h-[400px]">
                                <div dangerouslySetInnerHTML={{
                                    __html: getPreviewHtml(activeTab === 'customer' ? bookingTemplate : adminTemplate)
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
