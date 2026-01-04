'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Shield, Mail, Loader2, CheckCircle } from 'lucide-react';

export default function AgencyTeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        permissions: [] as string[]
    });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/agency/team');
            if (res.ok) {
                const data = await res.json();
                setTeam(data);
            }
        } catch (error) {
            console.error('Failed to load team', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const res = await fetch('/api/agency/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await fetchTeam();
                setIsInviting(false);
                setFormData({ name: '', email: '', password: '', permissions: [] });
                alert('Member invited successfully!');
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to invite member');
            }
        } catch (error) {
            console.error('Invite error', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm('Are you sure you want to remove this member? They will lose access immediately.')) return;

        try {
            const res = await fetch(`/api/agency/team/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTeam(prev => prev.filter(m => m._id !== id));
            } else {
                alert('Failed to remove member');
            }
        } catch (error) {
            console.error('Remove error', error);
        }
    };

    const togglePermission = (perm: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter(p => p !== perm)
                : [...prev.permissions, perm]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-slate-500">Invite staff and manage access permissions.</p>
                </div>
                <button
                    onClick={() => setIsInviting(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                    <UserPlus size={18} />
                    Invite Member
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : team.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Solo Operation?</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                        You haven't added any team members yet. Invite staff to let them book on your behalf without sharing your admin login.
                    </p>
                    <button
                        onClick={() => setIsInviting(true)}
                        className="mt-6 text-blue-600 font-bold hover:underline"
                    >
                        Invite your first member
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map(member => (
                        <div key={member._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                        {member.name.charAt(0)}
                                    </div>
                                    <button
                                        onClick={() => handleRemove(member._id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove Member"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-slate-900">{member.name}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                    <Mail size={14} />
                                    {member.email}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {member.permissions?.length > 0 ? (
                                        member.permissions.map((perm: string) => (
                                            <span key={perm} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase tracking-wider">
                                                {perm}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-xs font-medium italic">
                                            No explicit permissions
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                                <CheckCircle size={14} className="text-emerald-500" />
                                Active Account
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {isInviting && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Invite Team Member</h2>
                            <button onClick={() => setIsInviting(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Create a temporary password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'BOOKING', label: 'Create Bookings (Auto-debit)' },
                                        { id: 'FINANCE', label: 'View Wallet & Invoices' },
                                    ].map(perm => (
                                        <label key={perm.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(perm.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                                                {formData.permissions.includes(perm.id) && <CheckCircle size={14} />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.permissions.includes(perm.id)}
                                                onChange={() => togglePermission(perm.id)}
                                            />
                                            <span className="text-sm font-medium text-slate-700">{perm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsInviting(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Sending...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
