'use client';

import { useState } from 'react';
import { Users, FileUp, ClipboardList, ChevronLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface GroupStepProps {
    data: any;
    updateData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function GroupStep({ data, updateData, onNext, onBack }: GroupStepProps) {
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const bstr = event.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const passengerData = XLSX.utils.sheet_to_json(ws);

                updateData({
                    passengerList: passengerData,
                    passengers: passengerData.length > 0 ? passengerData.length : data.passengers
                });
                setUploadStatus('success');
            } catch (err) {
                console.error('File parsing error:', err);
                setUploadStatus('error');
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Passenger Information</h2>
                    <p className="text-slate-500 mt-1">Specify group size and upload manifest if available.</p>
                </div>
                <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Manual Count */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">
                        Total Passenger Count
                    </label>
                    <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="number"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white"
                            placeholder="e.g. 45"
                            value={data.passengers || ''}
                            onChange={(e) => updateData({ passengers: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                {/* 2. File Upload */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">
                        Upload Manifest (Optional)
                    </label>
                    <label className={`
                        flex flex-col items-center justify-center w-full h-[100px] border-2 border-dashed rounded-2xl cursor-pointer transition-all
                        ${uploadStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-800' :
                            uploadStatus === 'error' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/10 dark:border-red-800' :
                                'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-500'}
                    `}>
                        <div className="flex items-center gap-3">
                            {uploadStatus === 'success' ? <CheckCircle2 size={24} /> :
                                uploadStatus === 'error' ? <XCircle size={24} /> :
                                    <FileUp size={24} />}
                            <span className="font-bold text-sm">
                                {uploadStatus === 'success' ? `${data.passengerList.length} Passengers Loaded` :
                                    uploadStatus === 'error' ? 'Invalid File Format' :
                                        'Upload Excel / CSV'}
                            </span>
                        </div>
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">
                    Special Notes
                </label>
                <div className="relative group">
                    <ClipboardList className="absolute left-4 top-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <textarea
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white min-h-[120px]"
                        placeholder="Luggage requirements, group lead contact, flight info..."
                        value={data.notes}
                        onChange={(e) => updateData({ notes: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => {
                        if (!data.passengers) return alert('Please specify passenger count');
                        onNext();
                    }}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                >
                    Next: Review & Confirm
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
