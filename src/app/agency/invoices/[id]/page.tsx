'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Printer, Download, Mail, Phone, MapPin, Building2, Calendar, Clock, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateInvoice } from '@/services/InvoiceGenerator';

export default function InvoiceDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [booking, setBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [agencyInfo, setAgencyInfo] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Booking (Simulated via list for safety/ease if direct ID endpoint varies)
                const bookingsRes = await fetch('/api/bookings');
                if (bookingsRes.ok) {
                    const bookings = await bookingsRes.json();
                    const found = bookings.find((b: any) => b.id === id || b._id === id);
                    if (found) setBooking(found);
                }

                // Fetch Current User (Agency) Info for "Bill To"
                const userRes = await fetch('/api/auth/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setAgencyInfo(userData.user);
                }

            } catch (error) {
                console.error('Failed to load invoice', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleDownloadPDF = async () => {
        if (!booking) return;
        setIsGenerating(true);
        try {
            await generateInvoice(booking, agencyInfo);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
                <h2 className="text-xl font-bold text-slate-900">Invoice not found</h2>
                <Link href="/agency/invoices" className="mt-4 text-blue-600 hover:underline">Return to Invoices</Link>
            </div>
        );
    }

    // Helper to parse price
    const getPrice = (priceStr: string | number) => {
        if (!priceStr) return 0;
        const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    const subtotal = getPrice(booking.finalPrice);
    const vatRate = 0.15; // 15% VAT
    const vatAmount = subtotal - (subtotal / 1.15);
    const subtotalExclVat = subtotal - vatAmount;

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white pb-20 print:pb-0 font-sans">
            {/* Navigation - Hidden on Print */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 print:hidden">
                <div className="max-w-4xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/agency/invoices" className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="font-bold text-slate-900">Invoice Details</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.print()}
                            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Printer size={18} />
                            <span className="hidden sm:inline">Print</span>
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            ) : (
                                <Download size={18} />
                            )}
                            <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Download PDF'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoice Container */}
            <div className="max-w-4xl mx-auto p-4 lg:p-8 mt-4 print:mt-0 print:p-0 print:max-w-none">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none">

                    {/* Invoice Header */}
                    <div className="p-8 md:p-12 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between gap-8">
                            <div>

                                <h3 className="font-bold text-lg text-slate-900">Al Aqsa Umrah Transport</h3>
                                <h3 className="font-bold text-lg text-slate-900 font-arabic">الأقصى لنقل المعتمرين</h3>
                                <p className="text-slate-500 text-sm mt-1">King Abdulaziz Rd, Al Faisaliyah</p>
                                <p className="text-slate-500 text-sm">Jeddah 23442, Saudi Arabia</p>
                                <p className="text-slate-500 text-sm mt-1">VAT: 300123456700003</p>
                                <p className="text-slate-500 text-sm">support@alaqsafleet.com</p>
                            </div>
                            <div className="text-right md:text-right">
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">INVOICE <span className="text-xl font-arabic font-bold text-slate-400">فاتورة</span></h1>
                                <p className="text-slate-500 mt-1">#INV-{booking.id.slice(0, 8).toUpperCase()}</p>
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600">
                                    <span className="flex items-center gap-2">Status / <span className="font-arabic">الحالة</span>:</span>
                                    <span className={booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>
                                        {booking.paymentStatus === 'paid' ? 'PAID / مدفوع' : 'UNPAID / غير مدفوع'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Info Grid */}
                    <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between">
                                <span>Bill To</span>
                                <span className="font-arabic">فاتورة إلى</span>
                            </h4>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-slate-300"><Building2 size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{agencyInfo?.name || booking.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{agencyInfo?.email || booking.email}</p>
                                    <p className="text-slate-500 text-sm">{booking.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 text-sm flex flex-col"><span>Invoice Date</span><span className="font-arabic text-xs">تاريخ الفاتورة</span></span>
                                <span className="font-bold text-slate-900">{new Date(booking.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 text-sm flex flex-col"><span>Due Date</span><span className="font-arabic text-xs">تاريخ الاستحقاق</span></span>
                                <span className="font-bold text-slate-900">{new Date(booking.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 text-sm flex flex-col"><span>Service Date</span><span className="font-arabic text-xs">تاريخ الخدمة</span></span>
                                <span className="font-bold text-slate-900">{booking.date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="px-8 md:px-12">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Description <span className="block font-arabic text-[10px] mt-1">الوصف</span>
                                    </th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                        Qty <span className="block font-arabic text-[10px] mt-1">الكمية</span>
                                    </th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                        Unit Price <span className="block font-arabic text-[10px] mt-1">سعر الوحدة</span>
                                    </th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                        Total <span className="block font-arabic text-[10px] mt-1">المجموع</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {/* Main Vehicle Item */}
                                <tr>
                                    <td className="py-4">
                                        <p className="font-bold text-slate-900">{booking.vehicle || 'Standard Vehicle'}</p>
                                        <p className="text-sm text-slate-500 mt-0.5">{booking.pickup} to {booking.dropoff}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">One Way</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right align-top font-medium text-slate-700">{booking.vehicleCount || booking.selectedVehicles?.length || 1}</td>
                                    <td className="py-4 text-right align-top font-medium text-slate-700">
                                        SAR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 text-right align-top font-bold text-slate-900">
                                        SAR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>

                                {/* Example of Additional item if present in future */}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="p-8 md:p-12 bg-slate-50/50 mt-4">
                        <div className="flex flex-col md:flex-row justify-end">
                            <div className="w-full md:w-1/2 space-y-3">
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>Subtotal <span className="font-arabic text-xs">(المجموع الفرعي)</span></span>
                                    <span className="font-medium">SAR {subtotalExclVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>VAT (15%) <span className="font-arabic text-xs">(ضريبة القيمة المضافة)</span></span>
                                    <span className="font-medium">SAR {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between text-slate-900 text-xl font-bold">
                                    <span>Total <span className="font-arabic text-lg font-bold">المجموع</span></span>
                                    <span>SAR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Terms */}
                    <div className="p-8 md:p-12 border-t border-slate-100 text-slate-500 text-sm">
                        <h4 className="font-bold text-slate-900 mb-2">Payment Terms <span className="font-arabic">شروط الدفع</span></h4>
                        <p className="mb-4">
                            Please note that all invoices are due upon receipt unless otherwise agreed in your agency contract.
                            <br /><span className="font-arabic text-xs">يرجى ملاحظة أن جميع الفواتير مستحقة الدفع عند الاستلام ما لم يتم الاتفاق على خلاف ذلك في العقد.</span>
                        </p>

                        <h4 className="font-bold text-slate-900 mb-2">Bank Details <span className="font-arabic">تفاصيل البنك</span></h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div>
                                <span className="block text-slate-400 mb-1">Bank Name</span>
                                <span className="font-bold text-slate-800">Al Rajhi Bank</span>
                            </div>
                            <div>
                                <span className="block text-slate-400 mb-1">Account Name</span>
                                <span className="font-bold text-slate-800">Al Aqsa Transport Co.</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <span className="block text-slate-400 mb-1">IBAN</span>
                                <span className="font-bold text-slate-800">SA55 8000 0000 1234 5678 9012</span>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-xs text-slate-400">
                            Thank you for your business <span className="mx-2">•</span> <span className="font-arabic">شكراً لتعاملكم معنا</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
