'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    target?: string;
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
            <Link href={href} className={baseStyles} {...(props as any)}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={cn(baseStyles, "hover:scale-[1.02] active:scale-[0.98]")}
            {...props}
        >
            {children}
        </button>
    );
}
