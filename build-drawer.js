const fs = require('fs');

let navContent = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// 1. Add AnimatePresence to framer-motion import
if (navContent.includes('import { useScroll, useSpring, motion } from "framer-motion";')) {
    navContent = navContent.replace(
        'import { useScroll, useSpring, motion } from "framer-motion";',
        'import { useScroll, useSpring, motion, AnimatePresence } from "framer-motion";'
    );
}

// 2. Define our Framer Motion variants right inside the component (or we can just inject them directly in the JSX)
// We will inject the new mobile menu JSX.
const oldBackdropStart = navContent.indexOf('{/* Backdrop */}');
if (oldBackdropStart !== -1) {
    const headerEnd = navContent.indexOf('</nav>');
    const bottomPart = navContent.substring(headerEnd);

    const newMenuJSX = `
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
                        className="fixed inset-0 z-40 flex flex-col ios-glass bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl xl:hidden overflow-hidden"
                    >
                        {/* Header of the drawer */}
                        <div className="flex items-center justify-between p-4 sm:p-6 pb-2">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="flex items-center gap-3"
                            >
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="relative w-[55px] h-[55px] sm:w-[70px] sm:h-[70px]">
                                    <Image
                                        src="/logo.png"
                                        alt="Al Aqsa Transport"
                                        fill
                                        className="object-contain"
                                        sizes="70px"
                                    />
                                </Link>
                                <div className="flex flex-col items-start">
                                    <span className="text-xl sm:text-2xl font-bold text-secondary leading-none">Al Aqsa</span>
                                    <span className="text-[0.65rem] sm:text-xs font-bold text-foreground dark:text-white tracking-[0.15em] uppercase leading-none mt-1">Transport</span>
                                </div>
                            </motion.div>
                            {/* Close button handled by main toggle button, which stays on top */}
                        </div>

                        {/* Main Links Area */}
                        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-8 pb-32 no-scrollbar">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    visible: {
                                        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                                    },
                                    exit: {
                                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                    }
                                }}
                                className="flex flex-col gap-6"
                            >
                                {links.map((link) => (
                                    <motion.div 
                                        key={link.href} 
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                                            exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
                                        }}
                                        className="flex flex-col"
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setTimeout(() => setIsMenuOpen(false), 150)}
                                            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground dark:text-white flex items-center justify-between group"
                                        >
                                            <span>{link.label}</span>
                                            {mounted && pathname === link.href && (
                                                <motion.span layoutId="activeDot" className="w-2.5 h-2.5 rounded-full bg-secondary" />
                                            )}
                                        </Link>

                                        {link.megaMenu && (
                                            <div className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                                                {[...link.megaMenu.main, ...link.megaMenu.sidebar.items].map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setTimeout(() => setIsMenuOpen(false), 150)}
                                                        className="text-lg font-medium text-foreground/70 dark:text-slate-400 hover:text-secondary dark:hover:text-secondary transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Bottom Actions */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 300, damping: 28 }}
                            className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 pointer-events-none"
                        >
                            <div className="pointer-events-auto flex flex-col gap-4 mt-12">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
                                    <span className="text-sm font-bold text-foreground dark:text-white uppercase tracking-wider">Appearance</span>
                                    <ThemeToggle />
                                </div>
                                <GlassButton
                                    href="/booking"
                                    variant="secondary"
                                    size="lg"
                                    className="w-full justify-center shadow-2xl shadow-secondary/20 font-bold text-xl !bg-gradient-to-r !from-[#D4AF37] !to-[#B49126] !text-[#0A1F44] !border-none transition-transform duration-300 hover:scale-[1.02]"
                                    onClick={() => setTimeout(() => setIsMenuOpen(false), 150)}
                                >
                                    Book Now
                                </GlassButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        `;

    const newContent = navContent.substring(0, oldBackdropStart) + newMenuJSX + bottomPart;
    fs.writeFileSync('src/components/layout/Navbar.tsx', newContent);
    console.log("Navbar successfully updated!");
} else {
    console.log("Could not find the insertion point.");
}
