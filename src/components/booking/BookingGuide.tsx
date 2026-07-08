'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, MessageCircle, MapPin, Car, User, ClipboardList, CheckCircle, BookOpen } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useEffect } from 'react';

interface BookingGuideProps {
    isOpen: boolean;
    onClose: () => void;
    step: number;
}

export default function BookingGuide({ isOpen, onClose, step }: BookingGuideProps) {
    const { settings } = useSettings();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <MapPin className="text-secondary" size={20} />
                                Journey Selection
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">•</span>
                                    <span><strong>Single vs. Multiple Routes:</strong> You can book a single trip or build a complete itinerary with multiple routes in one go.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">•</span>
                                    <span><strong>Selecting Dates:</strong> Ensure you select the correct pickup date and time for each route.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">•</span>
                                    <span><strong>Common Mistakes:</strong> Double-check AM/PM when selecting your pickup time to avoid confusion.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Car className="text-secondary" size={20} />
                                Choosing the Right Vehicle
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Select the vehicle category that best matches your group size and luggage requirements. If you are booking multiple routes, you can use the <strong>same vehicle</strong> for all journeys or select <strong>different vehicles</strong> for individual routes.
                            </p>
                            
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Recommended Categories</h4>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Group Size</th>
                                            <th className="px-4 py-3 font-semibold">Vehicle</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                                        <tr>
                                            <td className="px-4 py-3">1–4 Passengers</td>
                                            <td className="px-4 py-3 font-medium">Sedan</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">5–7 Passengers</td>
                                            <td className="px-4 py-3 font-medium">7-Seater MPV</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">8–10 Passengers</td>
                                            <td className="px-4 py-3 font-medium">10/11-Seater Van</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">11–18 Passengers</td>
                                            <td className="px-4 py-3 font-medium">19-Seater Coaster</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 rounded-xl p-4 flex gap-3">
                            <Info size={18} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-sm font-medium text-amber-800 dark:text-amber-400">
                                <p className="mb-2"><strong>Helpful Tips:</strong></p>
                                <ul className="space-y-1 list-disc pl-4 opacity-90">
                                    <li>Consider luggage when choosing your vehicle.</li>
                                    <li>Families with elderly passengers often prefer larger vehicles for added comfort.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <User className="text-secondary" size={20} />
                                Traveller Details
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">•</span>
                                    <span><strong>Contact Details:</strong> We use your phone number (WhatsApp) and email to send driver details and booking updates.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">•</span>
                                    <span><strong>Flight Information:</strong> If your pickup is at an airport, providing your flight number allows us to monitor for delays and adjust pickup times automatically.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">•</span>
                                    <span><strong>Special Requests:</strong> Please specify if you need child seats, wheelchair assistance, or extra luggage space.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <ClipboardList className="text-secondary" size={20} />
                                Review Step
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                Please take a moment to verify all your information before confirming:
                            </p>
                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Verify routes and travel dates</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Verify passenger details and contact info</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Review total pricing</span>
                                </li>
                            </ul>
                            <div className="mt-6 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">What happens after confirmation?</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Our team will process your booking and you will receive a confirmation email. Driver details will be shared prior to your pickup.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const whatsappNumber = settings?.contact?.whatsapp?.replace(/[^0-9]/g, '') || '';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-slate-950 shadow-2xl z-[210] flex flex-col border-l border-slate-200 dark:border-slate-800"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary/10 p-2 rounded-lg">
                                    <BookOpen className="text-secondary" size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Booking Guide</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                aria-label="Close guide"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {renderContent()}
                        </div>

                        {/* Footer (Persistent Support) */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Need Assistance?</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Our support team is available 24/7 to answer booking questions or assist with your Umrah transportation plans.
                            </p>
                            {whatsappNumber && (
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-xl transition-colors font-bold text-sm shadow-sm"
                                >
                                    <MessageCircle size={18} />
                                    Chat on WhatsApp
                                </a>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
