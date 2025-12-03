'use client';

import { useState } from 'react';
import { Settings } from '@/lib/validations';
import { Save, Percent, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DiscountManagementProps {
    settings: Settings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (section: keyof Settings, data: any) => Promise<void>;
    isSaving: boolean;
}

export default function DiscountManagement({ settings, onSave, isSaving }: DiscountManagementProps) {
    const [formData, setFormData] = useState(settings.discount || {
        enabled: false,
        type: 'percentage',
        value: 0,
        startDate: '',
        endDate: '',
    });

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.value < 0) {
            alert('Discount value cannot be negative');
            return;
        }
        if (formData.type === 'percentage' && formData.value > 100) {
            alert('Percentage discount cannot exceed 100%');
            return;
        }
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            alert('End date must be after start date');
            return;
        }

        await onSave('discount', formData);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Discount Management</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Configure site-wide discounts and promotional offers.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                            {formData.enabled ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.enabled ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-200 text-slate-500'}`}>
                            <Percent size={20} />
                        </div>
                        <div>
                            <label htmlFor="discount-enabled" className="block text-sm font-medium text-slate-900 dark:text-white cursor-pointer">
                                Enable Discount
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Turn this on to activate the discount across the site.
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="discount-enabled"
                            className="sr-only peer"
                            checked={formData.enabled}
                            onChange={(e) => handleChange('enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Discount Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Discount Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleChange('type', 'percentage')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${formData.type === 'percentage'
                                    ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-400'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <Percent size={18} />
                                <span className="text-sm font-medium">Percentage (%)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('type', 'fixed')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${formData.type === 'fixed'
                                    ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-400'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <DollarSign size={18} />
                                <span className="text-sm font-medium">Fixed Amount (SAR)</span>
                            </button>
                        </div>
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Discount Value
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {formData.type === 'percentage' ? (
                                    <Percent size={18} className="text-slate-400" />
                                ) : (
                                    <span className="text-slate-400 text-sm font-bold">SAR</span>
                                )}
                            </div>
                            <input
                                type="number"
                                min="0"
                                max={formData.type === 'percentage' ? "100" : undefined}
                                value={formData.value ?? 0}
                                onChange={(e) => handleChange('value', Number(e.target.value))}
                                className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholder="0"
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {formData.type === 'percentage'
                                ? 'Enter percentage (e.g., 20 for 20% off)'
                                : 'Enter fixed amount in SAR (e.g., 50 for 50 SAR off)'}
                        </p>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Start Date (Optional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Calendar size={18} className="text-slate-400" />
                            </div>
                            <DatePicker
                                selected={formData.startDate ? new Date(formData.startDate) : null}
                                onChange={(date) => handleChange('startDate', date ? date.toISOString() : '')}
                                className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholderText="Select start date"
                                dateFormat="MMMM d, yyyy"
                                isClearable
                            />
                        </div>
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            End Date (Optional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Calendar size={18} className="text-slate-400" />
                            </div>
                            <DatePicker
                                selected={formData.endDate ? new Date(formData.endDate) : null}
                                onChange={(date) => handleChange('endDate', date ? date.toISOString() : '')}
                                className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholderText="Select end date"
                                dateFormat="MMMM d, yyyy"
                                minDate={formData.startDate ? new Date(formData.startDate) : undefined}
                                isClearable
                            />
                        </div>
                    </div>
                </div>

                {formData.enabled && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
                        <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                        <div>
                            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Discount is Active</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                Users will see a banner and receive {formData.type === 'percentage' ? `${formData.value}%` : `${formData.value} SAR`} off on all bookings
                                {formData.endDate ? ` until ${new Date(formData.endDate).toLocaleDateString()}` : ''}.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
