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
        primary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20",
        outline: "border-2 border-white text-white hover:bg-white/10"
    };

    const sizes = {
        sm: "h-9 px-4 py-2 text-sm",
        md: "h-11 px-8 py-2 text-base",
        lg: "h-14 px-10 py-3 text-lg"
    };

    const baseStyles = cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-bold",
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
