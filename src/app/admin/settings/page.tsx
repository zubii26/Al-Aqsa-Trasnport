'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, MessageCircle, Video, Search, Code, Layout, AtSign, Hash, FileText, Link as LinkIcon } from 'lucide-react';
import styles from '../admin.module.css';
import { Toast, ToastType } from '@/components/ui/Toast';

type Tab = 'general' | 'contact' | 'social' | 'seo' | 'scripts';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    const [settings, setSettings] = useState({
        site_name: '',
        site_description: '',
        contact_phone: '',
        contact_phone_2: '',
        contact_email: '',
        address: '',
        social_facebook: '',
        social_instagram: '',
        social_twitter: '',
        social_linkedin: '',
        social_tiktok: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        scripts_header: '',
        scripts_footer: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                showToast('Settings saved successfully!', 'success');
            } else {
                showToast('Failed to save settings', 'error');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            showToast('Error saving settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true });
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Layout, description: 'Site identity and basics' },
        { id: 'contact', label: 'Contact', icon: Phone, description: 'Address and phones' },
        { id: 'social', label: 'Social Media', icon: Globe, description: 'Social network links' },
        { id: 'seo', label: 'SEO', icon: Search, description: 'Search engine optimization' },
        { id: 'scripts', label: 'Scripts', icon: Code, description: 'Custom tracking scripts' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className={styles.title}>Settings</h1>
                    <p className="text-muted-foreground">Manage your website configuration and preferences</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                {/* Sidebar Navigation */}
                <div className="flex flex-col gap-2 sticky top-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left border ${isActive
                                    ? 'bg-white shadow-md border-amber-100'
                                    : 'hover:bg-white/50 border-transparent hover:border-slate-100'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-amber-500'}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className={`font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {tab.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                        {tab.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="relative min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={styles.glassCard}
                        >
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                            <Layout className="text-amber-500" size={28} />
                                            General Information
                                        </h2>
                                        <p className="text-muted-foreground">Basic details about your website identity.</p>
                                    </div>
                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Site Name</label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    name="site_name"
                                                    value={settings.site_name}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="Al Aqsa Umrah Transport"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Site Description</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-4 text-muted-foreground" size={18} />
                                                <textarea
                                                    name="site_description"
                                                    value={settings.site_description}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none min-h-[120px]"
                                                    placeholder="Brief description of your services..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                            <Phone className="text-amber-500" size={28} />
                                            Contact Details
                                        </h2>
                                        <p className="text-muted-foreground">How customers can reach you.</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    name="contact_phone"
                                                    value={settings.contact_phone}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="+966 50 123 4567"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Secondary Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    name="contact_phone_2"
                                                    value={settings.contact_phone_2}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="+966 50 987 6543"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="email"
                                                    name="contact_email"
                                                    value={settings.contact_email}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="info@alaqsa.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={settings.address}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="Makkah, Saudi Arabia"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'social' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                            <Globe className="text-amber-500" size={28} />
                                            Social Media
                                        </h2>
                                        <p className="text-muted-foreground">Connect your social platforms.</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { name: 'social_facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                                            { name: 'social_instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                                            { name: 'social_twitter', label: 'Twitter / X', icon: Twitter, color: 'text-sky-500' },
                                            { name: 'social_linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                                            { name: 'social_tiktok', label: 'TikTok', icon: Video, color: 'text-black' },
                                        ].map((social) => (
                                            <div key={social.name} className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                                                    <social.icon size={16} className={social.color} /> {social.label}
                                                </label>
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                    <input
                                                        type="text"
                                                        name={social.name}
                                                        value={settings[social.name as keyof typeof settings]}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                        placeholder={`https://${social.label.toLowerCase().split(' ')[0]}.com/...`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                            <Search className="text-amber-500" size={28} />
                                            SEO Configuration
                                        </h2>
                                        <p className="text-muted-foreground">Optimize your site for search engines.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Meta Title</label>
                                            <div className="relative">
                                                <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    name="seo_title"
                                                    value={settings.seo_title}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="Al Aqsa Umrah Transport - Premium Taxi Service"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-1">Recommended length: 50-60 characters</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Meta Description</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-4 text-muted-foreground" size={18} />
                                                <textarea
                                                    name="seo_description"
                                                    value={settings.seo_description}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none min-h-[100px]"
                                                    placeholder="Best Umrah taxi service in Saudi Arabia..."
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-1">Recommended length: 150-160 characters</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Keywords</label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    name="seo_keywords"
                                                    value={settings.seo_keywords}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                                                    placeholder="umrah taxi, makkah transport, jeddah airport taxi"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-1">Separate keywords with commas</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'scripts' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                            <Code className="text-amber-500" size={28} />
                                            Custom Scripts
                                        </h2>
                                        <p className="text-muted-foreground">Inject custom code into your site.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Header Scripts</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-4 text-muted-foreground font-mono text-xs">&lt;/&gt;</div>
                                                <textarea
                                                    name="scripts_header"
                                                    value={settings.scripts_header}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono text-sm min-h-[200px]"
                                                    placeholder="<!-- Google Analytics -->"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-1">Scripts injected into the &lt;head&gt; tag</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Footer Scripts</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-4 text-muted-foreground font-mono text-xs">&lt;/&gt;</div>
                                                <textarea
                                                    name="scripts_footer"
                                                    value={settings.scripts_footer}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-mono text-sm min-h-[200px]"
                                                    placeholder="<!-- Chat Widget -->"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-1">Scripts injected before the closing &lt;/body&gt; tag</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
