'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-background border-2 border-border rounded-2xl p-8 shadow-2xl text-center">
                    {/* Error Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mb-6 flex justify-center"
                    >
                        <div className="p-4 bg-destructive/10 rounded-full">
                            <AlertCircle className="w-16 h-16 text-destructive" />
                        </div>
                    </motion.div>

                    {/* Error Title */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold mb-3"
                    >
                        Something went wrong
                    </motion.h1>

                    {/* Error Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground mb-6"
                    >
                        Sorry, an unexpected error occurred while loading the presentation. Please try again.
                    </motion.p>

                    {/* Error Details (only in development) */}
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mb-6 p-4 bg-muted/50 rounded-lg text-left"
                        >
                            <p className="text-xs font-mono text-muted-foreground break-all">
                                {error.message}
                            </p>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <Button
                            onClick={reset}
                            className="gap-2"
                            size="lg"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try again
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            size="lg"
                            className="gap-2"
                        >
                            <Link href="/dashboard">
                                <Home className="w-4 h-4" />
                                Back to dashboard
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Error Code (if available) */}
                    {error.digest && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-6 text-xs text-muted-foreground"
                        >
                            Error code: {error.digest}
                        </motion.p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
