'use client';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronLeft, Search } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SearchableSelectProps {
    options: (string | Option)[];
    value: string;
    onChange: (e: { target: { name: string; value: string } }) => void;
    name: string;
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
    error?: string;
    disabled?: boolean;
    renderOption?: (option: Option) => React.ReactNode;
    emptyStateAction?: React.ReactNode;
    searchable?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    name,
    placeholder,
    className,
    icon,
    error,
    disabled,
    renderOption,
    emptyStateAction,
    searchable = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [mounted, setMounted] = useState(false);
    // Position of the dropdown portal, updated on open/scroll/resize
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // Normalize options to objects
    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);
    const isSelectedLabel = selectedOption && selectedOption.label === searchTerm;

    const filteredOptions = normalizedOptions.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedOptions = (isOpen && isSelectedLabel) ? normalizedOptions : filteredOptions;

    // Sync local search term with prop value
    useEffect(() => {
        const found = normalizedOptions.find(opt => opt.value === value);
        setSearchTerm(found ? found.label : value);
    }, [value, options]);

    // Calculate the viewport-relative position of the trigger for portal placement
    const updatePos = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width });
        }
    };

    // Close on outside click — checks both trigger and portal
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const portal = document.getElementById(`ss-portal-${name}`);
            const target = e.target as Node;
            if (
                containerRef.current && !containerRef.current.contains(target) &&
                !(portal && portal.contains(target))
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, name]);

    // Keep portal in sync with scroll & resize
    useEffect(() => {
        if (!isOpen) return;
        window.addEventListener('scroll', updatePos, true);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        onChange({ target: { name, value: e.target.value } });
    };

    const handleOptionClick = (option: Option) => {
        setSearchTerm(option.label);
        onChange({ target: { name, value: option.value } });
        setIsOpen(false);
    };

    const handleOpen = () => {
        if (disabled) return;
        updatePos();
        setIsOpen(true);
    };

    return (
        <div className={`relative w-full ${disabled ? 'opacity-60 pointer-events-none' : ''}`} ref={containerRef}>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-500 dark:text-white/60">
                        {icon}
                    </div>
                )}
                {/* Desktop input */}
                <input
                    type="text"
                    name={name}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleOpen}
                    placeholder={placeholder}
                    autoComplete="new-password"
                    disabled={disabled}
                    readOnly={!searchable}
                    className={`${className} ${icon ? 'pl-11' : ''} ${!searchable ? 'cursor-pointer' : ''} max-md:pointer-events-none max-md:opacity-0`}
                />
                {/* Mobile: invisible overlay triggers full-screen modal */}
                <div
                    className="md:hidden absolute inset-0 z-20 cursor-pointer"
                    onClick={() => !disabled && setIsOpen(true)}
                />
                {/* Mobile: read-only display input */}
                <input
                    type="text"
                    value={searchTerm}
                    placeholder={placeholder}
                    readOnly
                    className={`md:hidden ${className} ${icon ? 'pl-11' : ''} absolute inset-0 z-10`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-white/40 z-10">
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* ── Desktop Dropdown ─────────────────────────────────────────────────
                Portalled to <body> so it escapes ALL parent stacking contexts.
                Uses fixed positioning with viewport-relative coords from getBoundingClientRect.
            ────────────────────────────────────────────────────────────────────── */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            id={`ss-portal-${name}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'fixed',
                                top: dropdownPos.top + 6,
                                left: dropdownPos.left,
                                width: dropdownPos.width,
                                zIndex: 99999,
                            }}
                            className="hidden md:block max-h-80 overflow-y-auto
                                       bg-white/95 backdrop-blur-md dark:bg-slate-900/95
                                       border border-slate-100 dark:border-slate-800
                                       rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-2
                                       custom-scrollbar"
                        >
                            {displayedOptions.length > 0 ? displayedOptions.map((option) => (
                                <li
                                    key={option.value}
                                    // onMouseDown fires before onBlur — prevents input blur from closing before click registers
                                    onMouseDown={(e) => { e.preventDefault(); handleOptionClick(option); }}
                                    className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between text-sm border-b border-slate-50 dark:border-white/5 last:border-0
                                        ${value === option.value 
                                            ? 'bg-secondary/10 border-l-4 border-l-secondary text-secondary font-bold' 
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-l-transparent'
                                        }`}
                                >
                                    {renderOption ? renderOption(option) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                {option.icon && <span className="shrink-0 text-lg">{option.icon}</span>}
                                                <span className="font-medium">{option.label}</span>
                                            </div>
                                            {value === option.value && <Check size={14} className="text-secondary" />}
                                        </>
                                    )}
                                </li>
                            )) : (
                                <li className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center gap-3">
                                    No matching options found
                                    {emptyStateAction && <div className="mt-2 w-full">{emptyStateAction}</div>}
                                </li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* ── Mobile Full-Screen Modal ──────────────────────────────────────── */}
            {mounted && createPortal(
                <div className="md:hidden">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex-none bg-white dark:bg-slate-900 pt-safe border-b border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-2 p-4">
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
                                            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div className="flex-1 relative">
                                            {searchable ? (
                                                <>
                                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder={placeholder}
                                                        value={searchTerm}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-10 pr-4 py-3 text-base outline-none text-slate-900 dark:text-white"
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white font-medium flex items-center h-[48px]">
                                                    {placeholder || 'Select option'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Options */}
                                <ul className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/20 p-2">
                                    {displayedOptions.length > 0 ? displayedOptions.map((option) => (
                                        <li
                                            key={option.value}
                                            onClick={() => handleOptionClick(option)}
                                            className="px-4 py-4 cursor-pointer rounded-xl bg-white dark:bg-slate-800 mb-2
                                                       hover:bg-slate-50 shadow-sm
                                                       text-slate-700 dark:text-slate-200
                                                       transition-colors duration-150 flex items-center justify-between
                                                       text-base border border-slate-100 dark:border-slate-700 last:border-0"
                                        >
                                            {renderOption ? renderOption(option) : (
                                                <>
                                                    <div className="flex items-center gap-3">
                                                        {option.icon && <span className="shrink-0 text-lg">{option.icon}</span>}
                                                        <span className="font-semibold">{option.label}</span>
                                                    </div>
                                                    {value === option.value && <Check size={18} className="text-secondary" />}
                                                </>
                                            )}
                                        </li>
                                    )) : (
                                        <li className="px-4 py-10 text-center text-slate-500 dark:text-slate-400 text-base flex flex-col items-center gap-4">
                                            No matching options found
                                            {emptyStateAction && (
                                                <div className="mt-2 w-full flex justify-center">{emptyStateAction}</div>
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>,
                document.body
            )}

            {error && <span className="text-red-500 text-xs font-semibold mt-1 block">{error}</span>}
        </div>
    );
};

export default SearchableSelect;
