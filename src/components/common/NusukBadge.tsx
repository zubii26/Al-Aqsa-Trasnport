'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface NusukBadgeProps {
  className?: string;
  variant?: 'light' | 'dark' | 'gold';
  showText?: boolean;
}

export default function NusukBadge({ className = '', variant = 'gold', showText = true }: NusukBadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'light':
        return 'bg-white/10 text-white border-white/20';
      case 'dark':
        return 'bg-slate-900/50 text-slate-100 border-slate-700/50';
      case 'gold':
      default:
        return 'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_10px_rgba(212,175,55,0.15)]';
    }
  };

  return (
    <div className={`relative group inline-flex items-center justify-center ${className}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md cursor-help transition-all duration-300 ${getColors()}`}
      >
        <ShieldCheck size={16} className={variant === 'gold' ? 'text-secondary' : 'text-current'} />
        {showText && (
          <span className="text-xs font-bold uppercase tracking-wide">
            Nusuk Registered
          </span>
        )}
      </motion.div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border border-white/10">
        <div className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-secondary shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            All Al Aqsa Umrah Transport vehicles are officially registered and verified under the Nusuk system.
          </p>
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
}
