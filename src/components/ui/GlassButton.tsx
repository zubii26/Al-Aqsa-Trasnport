'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function GlassButton({
    href,
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: GlassButtonProps) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 border-transparent",
        outline: "bg-transparent border-primary/20 hover:bg-primary/5 text-foreground"
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg"
    };

    const baseStyles = cn(
        "glass-button inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
    );

    if (href) {
        return (
            <Link href={href} className={baseStyles}>
                {children}
            </Link>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={baseStyles}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...props as any}
        >
            {children}
        </motion.button>
    );
}
