'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Edit, Plus, Search } from 'lucide-react';

interface Section {
    _id: string;
    name: string;
    page: string;
    type: string;
    title: string;
    updatedAt: string;
}

export default function ContentManagementPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await fetch('/api/sections');
            if (res.ok) {
                const data = await res.json();
                setSections(data);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSections = sections.filter(section =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedSections = filteredSections.reduce((acc, section) => {
        const page = section.page || 'Other';
        if (!acc[page]) acc[page] = [];
        acc[page].push(section);
        return acc;
    }, {} as Record<string, Section[]>);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (confirm('This will seed default sections if they don\'t exist. Continue?')) {
                                fetch('/api/sections/seed', { method: 'POST' })
                                    .then(res => res.json())
                                    .then(data => {
                                        alert(data.message);
                                        fetchSections();
                                    });
                            }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Plus size={20} />
                        Seed Defaults
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search sections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading sections...</div>
            ) : Object.keys(groupedSections).length === 0 ? (
                <div className="text-center py-12 text-gray-600 dark:text-gray-300">No sections found. Try seeding defaults.</div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedSections).map(([page, pageSections]) => (
                        <div key={page} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{page} Page</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-900 dark:text-white">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wider">Section Name</th>
                                            <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wider">Last Updated</th>
                                            <th className="px-6 py-3 font-semibold text-sm uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {pageSections.map((section) => (
                                            <tr key={section._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                                    {section.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 dark:text-gray-200 text-sm capitalize">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                                        {section.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                                    {section.title}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                                                    {new Date(section.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/admin/content/${section._id}`}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
