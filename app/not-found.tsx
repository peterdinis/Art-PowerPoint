'use client';

import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                {/* 404 Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-6 flex justify-center"
                >
                    <div className="p-4 bg-primary/10 rounded-full">
                        <FileQuestion className="w-16 h-16 text-primary" />
                    </div>
                </motion.div>

                {/* 404 Title */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-8xl font-extrabold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold mb-3">Page not found</h2>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground mb-8"
                >
                    Sorry, but the page you are looking for does not exist or has been moved.
                </motion.p>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/dashboard">
                            <Home className="w-4 h-4" />
                            Back to dashboard
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
