'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Layers, Palette, Share2, Play, Code2, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function LandingPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Navbar */}
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-xl z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="p-1.5 bg-gradient-to-br from-primary to-primary/60 rounded-lg text-primary-foreground">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            SlideMaster
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="rounded-full"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                        <Link href="/dashboard">
                            <Button className="rounded-full">Go to App</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 lg:py-20">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Next Generation Presentations</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Create{' '}
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            stunning
                        </span>
                        <br />
                        presentations in seconds
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Modern editor with intuitive controls, smooth animations, and professional tools.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                Start Creating Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 max-w-7xl mx-auto">
                    {/* Large Feature - Drag & Drop */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-6 lg:col-span-8 row-span-2 group"
                    >
                        <div className="h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-3xl p-8 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
                                    <Layers className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Drag & Drop</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-3">Intuitive Editor</h3>
                                <p className="text-muted-foreground text-lg mb-6 max-w-md">
                                    Simple mouse controls. Drag, resize, and edit elements effortlessly.
                                </p>
                                <div className="flex gap-2">
                                    <div className="w-20 h-20 rounded-2xl bg-primary/20 border-2 border-primary/40 backdrop-blur-sm" />
                                    <div className="w-20 h-20 rounded-2xl bg-green-500/20 border-2 border-green-500/40 backdrop-blur-sm" />
                                    <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border-2 border-orange-500/40 backdrop-blur-sm" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Animations */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-3 lg:col-span-4 group"
                    >
                        <div className="h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <div className="relative z-10">
                                <Zap className="w-10 h-10 text-amber-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Smooth Animations</h3>
                                <p className="text-muted-foreground">
                                    Framer Motion for professional transitions
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dark Mode */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 }}
                        className="md:col-span-3 lg:col-span-4 group"
                    >
                        <div className="h-full bg-gradient-to-br from-slate-500/10 to-zinc-500/10 dark:from-slate-500/20 dark:to-zinc-500/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <div className="relative z-10">
                                <Moon className="w-10 h-10 text-slate-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Dark Mode</h3>
                                <p className="text-muted-foreground">
                                    Perfect look in every mode
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Templates */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-3 lg:col-span-4 group"
                    >
                        <div className="h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <div className="relative z-10">
                                <Palette className="w-10 h-10 text-purple-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Smart Templates</h3>
                                <p className="text-muted-foreground">
                                    Professional pre-made layouts
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Export & Share */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 }}
                        className="md:col-span-3 lg:col-span-4 group"
                    >
                        <div className="h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <div className="relative z-10">
                                <Share2 className="w-10 h-10 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Export & Share</h3>
                                <p className="text-muted-foreground">
                                    Share with one click
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Presentation Mode */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-6 lg:col-span-8 group"
                    >
                        <div className="h-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 rounded-3xl p-8 border border-border/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-4">
                                        <Play className="w-4 h-4 text-indigo-500" />
                                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Presentation</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-3">Fullscreen Mode</h3>
                                    <p className="text-muted-foreground text-lg max-w-md">
                                        Present with notes and timer directly in browser
                                    </p>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="w-32 h-24 rounded-xl bg-indigo-500/30 border-2 border-indigo-500/50 backdrop-blur-sm flex items-center justify-center">
                                        <Play className="w-12 h-12 text-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45 }}
                        className="md:col-span-6 lg:col-span-4 group"
                    >
                        <div className="h-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <div className="relative z-10">
                                <Code2 className="w-10 h-10 text-cyan-500 mb-4" />
                                <h3 className="text-2xl font-bold mb-3">Modern Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-background/50 border border-border text-xs font-medium">Next.js</span>
                                    <span className="px-3 py-1 rounded-full bg-background/50 border border-border text-xs font-medium">React</span>
                                    <span className="px-3 py-1 rounded-full bg-background/50 border border-border text-xs font-medium">Tailwind</span>
                                    <span className="px-3 py-1 rounded-full bg-background/50 border border-border text-xs font-medium">Framer Motion</span>
                                    <span className="px-3 py-1 rounded-full bg-background/50 border border-border text-xs font-medium">Shadcn/ui</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-12 border border-primary/20 backdrop-blur-sm">
                        <h2 className="text-4xl font-bold mb-4">Ready to start?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join thousands of creators and build your first presentation today.
                        </p>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all">
                                Create presentation for free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t mt-20">
                <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© 2026 SlideMaster. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
