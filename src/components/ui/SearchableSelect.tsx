import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

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
    renderOption
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize options to objects
    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    // If the searchTerm is exactly the label of the currently selected value, 
    // we want to show ALL options (user opened dropdown to change selection).
    // Otherwise, user is typing, so we filter.
    const selectedOption = normalizedOptions.find(opt => opt.value === value);
    const isSelectedLabel = selectedOption && selectedOption.label === searchTerm;

    // Filter options based on search term
    const filteredOptions = normalizedOptions.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedOptions = (isOpen && isSelectedLabel) ? normalizedOptions : filteredOptions;

    // Sync local search term with prop value updates
    useEffect(() => {
        const selectedOption = normalizedOptions.find(opt => opt.value === value);
        if (selectedOption) {
            setSearchTerm(selectedOption.label);
        } else {
            setSearchTerm(value);
        }
    }, [value, options]); // dependencies changed to re-eval when options change

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // If user typed something that matches an option exactly, ensure it's selected.
                // If it's custom text, keep it (Simulating free text input)
                // We don't force-reset here because we want to allow free text submission.
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        setIsOpen(true);
        onChange({ target: { name, value: newValue } });
    };

    const handleOptionClick = (option: Option) => {
        setSearchTerm(option.label);
        onChange({ target: { name, value: option.value } });
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${disabled ? 'opacity-60 pointer-events-none' : ''}`} ref={containerRef}>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-500 dark:text-white/60">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    name={name}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && setIsOpen(true)}
                    placeholder={placeholder}
                    autoComplete="off"
                    disabled={disabled}
                    className={`${className} ${icon ? 'pl-11' : ''}`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-white/40">
                    <ChevronDown size={16} />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && displayedOptions.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 z-[100] w-full mt-2 max-h-60 overflow-y-auto 
                                   bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl 
                                   border border-slate-200 dark:border-slate-700 
                                   rounded-xl shadow-2xl scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/20"
                    >
                        {displayedOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                                className="px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 
                                           text-slate-700 dark:text-slate-200 
                                           transition-colors duration-150 flex items-center justify-between
                                           text-sm border-b border-slate-50 dark:border-white/5 last:border-0"
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
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
            {error && <span className="text-red-500 text-xs font-semibold mt-1 block">{error}</span>}
        </div>
    );
};

export default SearchableSelect;
