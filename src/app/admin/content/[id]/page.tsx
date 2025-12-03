'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useParams } from 'next/navigation';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface Section {
    _id: string;
    name: string;
    page: string;
    type: string;
    title: string;
    subtitle: string;
    content: string;
    images: { url: string; alt: string; type: string }[];
    customFields?: { key: string; label: string; value: string; type: string }[];
    metaTitle: string;
    metaDescription: string;
}

export default function EditContentPage() {
    const params = useParams();
    const id = params?.id as string;
    const [section, setSection] = useState<Section | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [desktopImage, setDesktopImage] = useState<File | null>(null);
    const [mobileImage, setMobileImage] = useState<File | null>(null);
    const [previews, setPreviews] = useState<{ desktop: string | null; mobile: string | null }>({ desktop: null, mobile: null });
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const fetchSection = async () => {
            try {
                const res = await fetch(`/api/sections/${id}`);
                if (res.ok) {
                    const data = await res.json() as Section;
                    setSection(data);

                    const desktop = data.images?.find(img => img.type === 'desktop')?.url || null;
                    const mobile = data.images?.find(img => img.type === 'mobile')?.url || null;
                    setPreviews({ desktop, mobile });
                } else {
                    alert('Failed to load section');
                    router.push('/admin/content');
                }
            } catch (error) {
                console.error('Error fetching section:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSection();
    }, [id, router]);

    const handleImageChange = (type: 'desktop' | 'mobile', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'desktop') setDesktopImage(file);
            else setMobileImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCustomFieldChange = (index: number, value: string) => {
        if (!section || !section.customFields) return;
        const newFields = [...section.customFields];
        newFields[index].value = value;
        setSection({ ...section, customFields: newFields });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!section) return;

        setSaving(true);
        const formData = new FormData();
        formData.append('title', section.title);
        formData.append('subtitle', section.subtitle || '');
        formData.append('content', section.content || '');
        formData.append('metaTitle', section.metaTitle || '');
        formData.append('metaDescription', section.metaDescription || '');

        if (section.customFields) {
            formData.append('customFields', JSON.stringify(section.customFields));
        }

        if (desktopImage) formData.append('desktopImage', desktopImage);
        if (mobileImage) formData.append('mobileImage', mobileImage);

        try {
            const res = await fetch(`/api/sections/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                alert('Section updated successfully');
                router.refresh();
            } else {
                alert('Failed to update section');
            }
        } catch (error) {
            console.error('Error updating section:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!section) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/content"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Section</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {section.page} / {section.name}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Content</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => setSection({ ...section, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={section.subtitle || ''}
                                        onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Body Content
                                    </label>
                                    <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                                        <ReactQuill
                                            theme="snow"
                                            value={section.content || ''}
                                            onChange={(content) => setSection({ ...section, content })}
                                            className="text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Custom Fields */}
                        {section.customFields && section.customFields.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Custom Fields</h2>
                                <div className="space-y-4">
                                    {section.customFields.map((field, index) => (
                                        <div key={field.key}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type === 'text' || field.type === 'link' ? 'text' : field.type}
                                                value={field.value}
                                                onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">SEO Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        value={section.metaTitle || ''}
                                        onChange={(e) => setSection({ ...section, metaTitle: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Meta Description
                                    </label>
                                    <textarea
                                        value={section.metaDescription || ''}
                                        onChange={(e) => setSection({ ...section, metaDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Media</h2>

                            <div className="space-y-6">
                                {/* Desktop Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Desktop Image
                                    </label>
                                    <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3 border-2 border-dashed border-gray-300 dark:border-gray-600 group">
                                        {previews.desktop ? (
                                            <Image
                                                src={previews.desktop}
                                                alt="Desktop Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <Upload size={32} />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange('desktop', e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="text-white font-medium">Change Desktop</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        1920x1080px recommended.
                                    </p>
                                </div>

                                {/* Mobile Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mobile Image (Optional)
                                    </label>
                                    <div className="relative aspect-[9/16] w-2/3 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3 border-2 border-dashed border-gray-300 dark:border-gray-600 group">
                                        {previews.mobile ? (
                                            <Image
                                                src={previews.mobile}
                                                alt="Mobile Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <Upload size={32} />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange('mobile', e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="text-white font-medium">Change Mobile</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                        1080x1920px recommended.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Publish</h2>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
