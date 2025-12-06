'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Eye, Edit2, CheckCircle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface BlogPostFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    isEditing?: boolean;
}

const CATEGORIES = ['Guide', 'Travel Tips', 'Experience', 'Value', 'Spiritual', 'News', 'FAQ'];

export default function BlogPostForm({ initialData, isEditing = false }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');

    const [formData, setFormData] = useState({
        title: '',
        id: '', // Slug
        excerpt: '',
        content: '',
        category: 'Guide',
        image: '',
        author: '',
        tags: [] as string[],
        isPublished: true,
        metaTitle: '',
        metaDescription: '',
        alt: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags || [],
                isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
                metaTitle: initialData.metaTitle || '',
                metaDescription: initialData.metaDescription || '',
                alt: initialData.alt || '',
            });
        }
    }, [initialData]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            id: !isEditing ? generateSlug(title) : prev.id
        }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`
            };

            const url = isEditing ? `/api/blog/${initialData.id}` : '/api/blog';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save post');

            router.push('/admin/blog');
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50 dark:bg-slate-900 z-20 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {isEditing ? 'Edit Post' : 'New Blog Post'}
                        </h1>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${formData.isPublished ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <span className="text-slate-500 dark:text-slate-400">
                                {formData.isPublished ? 'Published' : 'Draft'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                    >
                        {previewMode ? <Edit2 size={18} /> : <Eye size={18} />}
                        <span>{previewMode ? 'Edit' : 'Preview'}</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-lg shadow-amber-500/20"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>{isEditing ? 'Update' : 'Publish'}</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'content' ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Content
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'seo' ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    SEO
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Settings
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">

                    {activeTab === 'content' && (
                        <>
                            {/* Title & Slug */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        className="w-full text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-600 dark:text-white p-0"
                                        placeholder="Enter post title..."
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 font-mono bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                                    <span className="text-slate-400">/blog/</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="bg-transparent border-none focus:ring-0 w-full p-0 text-slate-600 dark:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px] flex flex-col">
                                {!previewMode ? (
                                    <div className="h-[500px]">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.content}
                                            onChange={(content) => setFormData({ ...formData, content })}
                                            modules={modules}
                                            formats={formats}
                                            className="h-[450px]"
                                        />
                                    </div>
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none p-8">
                                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                    </div>
                                )}
                            </div>

                            {/* Excerpt */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Excerpt
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    placeholder="Short summary for cards and SEO..."
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'seo' && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                            <h3 className="font-semibold text-slate-800 dark:text-white">Search Engine Optimization</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    placeholder="Title tag for search engines"
                                />
                                <p className="text-xs text-slate-500 mt-1">Recommended length: 50-60 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Meta Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    placeholder="Description for search results"
                                />
                                <p className="text-xs text-slate-500 mt-1">Recommended length: 150-160 characters</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                            <h3 className="font-semibold text-slate-800 dark:text-white">Post Settings</h3>
                            <p className="text-slate-500">Additional configuration options can go here.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Publishing</h3>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg mb-4">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${formData.isPublished ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            {formData.isPublished ? (
                                <><CheckCircle size={14} className="text-green-500" /> Visible to public</>
                            ) : (
                                <><AlertCircle size={14} className="text-amber-500" /> Only visible to admins</>
                            )}
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Metadata</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Author
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-medium">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-amber-900 dark:hover:text-amber-100"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm"
                                placeholder="Type and press Enter..."
                            />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Featured Image</h3>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            try {
                                                // Attempt 1: Client-Side Upload (Preferred for large files)
                                                // 1. Get signature
                                                const signRes = await fetch('/api/upload?type=signature', { method: 'POST' });
                                                const signData = await signRes.json();

                                                if (!signData.success) {
                                                    throw new Error(signData.error || 'Failed to get upload signature');
                                                }

                                                // 2. Upload directly to Cloudinary
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                formData.append('api_key', signData.apiKey);
                                                formData.append('timestamp', signData.timestamp.toString());
                                                formData.append('signature', signData.signature);
                                                formData.append('folder', signData.folder);

                                                const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;

                                                // DEBUG: Show exactly what is being sent
                                                // alert(`DEBUG INFO:\nURL: ${uploadUrl}\nAPI Key: ${signData.apiKey}\nCloud Name: ${signData.cloudName}\nFile Name: ${file.name}`);

                                                try {
                                                    const uploadRes = await fetch(uploadUrl, { method: 'POST', body: formData });
                                                    if (!uploadRes.ok) throw new Error('Network response was not ok');
                                                    const uploadData = await uploadRes.json();

                                                    if (uploadData.secure_url) {
                                                        setFormData(prev => ({ ...prev, image: uploadData.secure_url }));
                                                        return;
                                                    }
                                                } catch (directError) {
                                                    console.warn('Direct upload failed, switching to server fallback...', directError);
                                                    throw new DirectUploadError();
                                                }

                                            } catch (clientError) {
                                                // Attempt 2: Server-Side Fallback (For small files <4.5MB)
                                                try {
                                                    const fallbackFormData = new FormData();
                                                    fallbackFormData.append('file', file);

                                                    const serverRes = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: fallbackFormData
                                                    });

                                                    const serverData = await serverRes.json();

                                                    if (serverData.success) {
                                                        setFormData(prev => ({ ...prev, image: serverData.url }));
                                                    } else {
                                                        // If server also failed (e.g. payload too large), show specific error
                                                        throw new Error(serverData.error || 'Upload failed');
                                                    }
                                                } catch (serverError) {
                                                    console.error('Final upload failure:', serverError);
                                                    alert('Upload failed: ' + (serverError instanceof Error ? serverError.message : 'Unknown error'));
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm"
                                placeholder="Or enter image URL manually..."
                            />

                            {formData.image ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                                    <Image
                                        src={formData.image}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                        Preview
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-sm">No image selected</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Image Alt Text
                            </label>
                            <input
                                type="text"
                                value={formData.alt}
                                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm"
                                placeholder="Describe the image for SEO..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

class DirectUploadError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'DirectUploadError';
    }
}
