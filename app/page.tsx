'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Zap, Layout, Share2, Presentation, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 100 },
    },
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
            {/* Navbar */}
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                            <Presentation className="w-5 h-5" />
                        </div>
                        <span>SlideMaster</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button>Prejsť do aplikácie</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))]" />
                    <div className="container relative z-10 px-4 mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-4xl mx-auto"
                        >
                            <motion.div variants={itemVariants} className="flex justify-center mb-6">
                                <Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full border border-primary/20 bg-primary/5 text-primary">
                                    ✨ Nová generácia prezentácií
                                </Badge>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-primary dark:to-white bg-clip-text text-transparent pb-2">
                                Vytvárajte ohromujúce prezentácie <span className="text-primary block mt-2">v priebehu sekúnd.</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                Moderný editor prezentácií s intuitívnym ovládaním, plynulými animáciami a profesionálnymi nástrojmi. Zabudnite na PowerPoint.
                            </motion.p>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/dashboard">
                                    <Button size="lg" className="h-14 px-8 text-lg gap-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105">
                                        Začať tvoriť zadarmo
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full hover:bg-muted/50 transition-all">
                                        Zistiť viac
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-20 bg-muted/30">
                    <div className="container px-4 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Všetko čo potrebujete</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Naša platforma poskytuje komplexnú sadu nástrojov pre tvorbu moderných a pútavých prezentácií.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Layers className="w-8 h-8 text-blue-500" />}
                                title="Intuitívny Editor"
                                description="Drag & Drop rozhranie s inteligentným zarovnávaním a jednoduchou manipuláciou s elementmi."
                            />
                            <FeatureCard
                                icon={<Zap className="w-8 h-8 text-amber-500" />}
                                title="Plynulé Animácie"
                                description="Vstavaná podpora pre Framer Motion zabezpečuje profesionálne prechody a efekty."
                            />
                            <FeatureCard
                                icon={<Layout className="w-8 h-8 text-purple-500" />}
                                title="Smart Layouty"
                                description="Automatické prispôsobenie obsahu a responzívne šablóny pre perfektný vzhľad."
                            />
                            <FeatureCard
                                icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
                                title="Shadcn UI"
                                description="Postavené na najnovších technológiách a modernom dizajnovom systéme pre konzistentný zážitok."
                            />
                            <FeatureCard
                                icon={<Share2 className="w-8 h-8 text-pink-500" />}
                                title="Jednoduché Zdieľanie"
                                description="Exportujte svoje prezentácie alebo ich prezentujte priamo v prehliadači jedným klikom."
                            />
                            <FeatureCard
                                icon={<Presentation className="w-8 h-8 text-indigo-500" />}
                                title="Mód Prezentácie"
                                description="Fullscreen mód s poznámkami pre prezentujúceho a časovačom."
                            />
                        </div>
                    </div>
                </section>

                {/* Tech Stack / Trust */}
                <section className="py-20 border-t">
                    <div className="container px-4 mx-auto text-center">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                            Poháňané modernými technológiami
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <span className="bg-black text-white px-2 py-1 rounded text-sm">Next.js</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <span className="text-blue-500">React</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <span className="text-cyan-500">Tailwind CSS</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <span className="text-pink-500">Framer Motion</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <span className="text-black dark:text-white">Shadcn/ui</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="container px-4 mx-auto text-center relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Pripravení začať?</h2>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            Pripojte sa k tisíckam tvorcov a posuňte svoje prezentácie na novú úroveň ešte dnes.
                        </p>
                        <Link href="/dashboard">
                            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full font-semibold shadow-2xl hover:scale-105 transition-transform">
                                Vytvoriť prezentáciu zadarmo
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t bg-muted/50">
                <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© 2026 SlideMaster. Všetky práva vyhradené.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-foreground transition-colors">Podmienky</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Súkromie</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Kontakt</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm hover:bg-background transition-colors">
            <CardHeader>
                <div className="mb-4 p-3 bg-muted rounded-xl w-fit">
                    {icon}
                </div>
                <CardTitle className="text-xl mb-2">{title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
