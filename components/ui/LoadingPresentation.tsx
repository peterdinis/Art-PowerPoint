"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function LoadingPresentation({
	message = "Loading your presentation...",
}: {
	message?: string;
}) {
	const [activeSlide, setActiveSlide] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveSlide((prev) => (prev + 1) % 3);
		}, 1500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl">
			{/* Animated Miniature Presentation */}
			<div className="relative w-80 aspect-video mb-8 perspective-1000">
				<div className="absolute inset-0 bg-card/40 rounded-2xl border border-primary/20 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeSlide}
							initial={{ opacity: 0, x: 50, scale: 0.95 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, x: -50, scale: 0.95 }}
							transition={{ duration: 0.5, ease: "circOut" }}
							className="absolute inset-0 p-6 flex flex-col justify-center"
						>
							{activeSlide === 0 && (
								<div className="space-y-4">
									<div className="h-6 w-3/4 bg-primary/20 rounded-full animate-pulse" />
									<div className="h-4 w-1/2 bg-muted rounded-full opacity-60" />
									<div className="h-4 w-2/3 bg-muted rounded-full opacity-40" />
								</div>
							)}
							{activeSlide === 1 && (
								<div className="flex gap-4 items-center">
									<div className="w-24 h-24 bg-primary/10 rounded-xl flex items-center justify-center">
										<Sparkles className="w-8 h-8 text-primary/40 animate-spin-slow" />
									</div>
									<div className="flex-1 space-y-3">
										<div className="h-5 w-full bg-primary/20 rounded-full" />
										<div className="h-4 w-5/6 bg-muted rounded-full" />
									</div>
								</div>
							)}
							{activeSlide === 2 && (
								<div className="grid grid-cols-2 gap-3">
									<div className="h-20 bg-primary/10 rounded-lg" />
									<div className="h-20 bg-muted/20 rounded-lg" />
									<div className="h-8 col-span-2 bg-primary/20 rounded-full" />
								</div>
							)}
						</motion.div>
					</AnimatePresence>

					{/* Progress Bar in Mini-Preview */}
					<div className="absolute bottom-4 left-6 right-6 h-1 bg-muted/30 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-primary"
							animate={{ width: `${(activeSlide + 1) * 33.33}%` }}
							transition={{ duration: 0.5 }}
						/>
					</div>
				</div>

				{/* Floating Elements Background */}
				<motion.div
					animate={{
						y: [0, -15, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
					className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full opacity-30"
				/>
				<motion.div
					animate={{
						y: [0, 15, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
					className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 blur-3xl rounded-full opacity-20"
				/>
			</div>

			{/* Loading Text and Indicator */}
			<div className="text-center space-y-4">
				<div className="flex items-center justify-center gap-2">
					<div className="flex gap-1">
						<motion.span
							animate={{ opacity: [0.3, 1, 0.3] }}
							transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
							className="w-2 h-2 rounded-full bg-primary"
						/>
						<motion.span
							animate={{ opacity: [0.3, 1, 0.3] }}
							transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
							className="w-2 h-2 rounded-full bg-primary"
						/>
						<motion.span
							animate={{ opacity: [0.3, 1, 0.3] }}
							transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
							className="w-2 h-2 rounded-full bg-primary"
						/>
					</div>
					<h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
						{message}
					</h2>
				</div>
				<p className="text-sm text-muted-foreground max-w-xs mx-auto opacity-70">
					Preparing your beautiful slides for the best experience.
				</p>
			</div>

			<style jsx global>{`
				.perspective-1000 {
					perspective: 1000px;
				}
				.animate-spin-slow {
					animation: spin 8s linear infinite;
				}
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}
