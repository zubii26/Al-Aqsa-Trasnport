"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";



import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-full
                bg-white/10 dark:bg-black/20
                backdrop-blur-md
                border border-white/20 dark:border-white/10
                shadow-lg hover:shadow-xl
                transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1)
                hover:scale-110 active:scale-95
                group
            `}
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`
                        absolute inset-0 w-full h-full
                        text-amber-500
                        transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1)
                        ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
                    `}
                />
                <Moon
                    className={`
                        absolute inset-0 w-full h-full
                        text-blue-400
                        transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1)
                        ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
                    `}
                />
            </div>

            {/* Subtle Glow */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-amber-500/10 to-blue-500/10 blur-md -z-10" />
        </button>
    );
}
