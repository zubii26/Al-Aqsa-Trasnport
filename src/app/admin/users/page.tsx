'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Shield, User as UserIcon, Loader2, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { Toast } from '@/components/ui/Toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'operational_manager' | 'driver';
    createdAt: string;
}

export default function UsersPage() {
    // ... existing code ...

    return (
        // ... existing code ...
                                    <div className={`p-3 rounded-full ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                        user.role === 'driver' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                        {user.role === 'admin' ? <Shield size={24} /> : 
                                         user.role === 'driver' ? <Car size={24} /> :
                                         <UserIcon size={24} />}
                                    </div>
                                    <div className="flex gap-2">
                                        {/* ... buttons ... */}
                                    </div>
                                </div >
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{user.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                        user.role === 'driver' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                        {user.role}
                                    </span>
                                    {/* ... date ... */}
                                </div>
                            </motion.div >
                        ))
}
                    </AnimatePresence >
                </div >
            )}

{
    isModalOpen && (
                // ... modal outer ...
                            // ... fields ...
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                >
                                    <option value="manager">Manager</option>
                                    <option value="operational_manager">Operational Manager</option>
                                    <option value="driver">Driver</option>
                                    <option value="admin">Boss Admin</option>
                                </select>
                            </div>
                            // ... buttons ...
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-70 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    {submitting ? 'Saving...' : (editingId ? 'Update User' : 'Create User')}
                                </button>
                            </div>
                        </form >
                    </motion.div >
                </div >
            )
}

            <AdminConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                isDestructive
            />

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div >
    );
}
