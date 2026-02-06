"use client";

import { motion } from "framer-motion";
import { Presentation, Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
			<div className="text-center">
				{/* Animated Logo */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="mb-8 flex justify-center"
				>
					<div className="relative">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
							className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-xl"
						/>
						<div className="relative p-6 bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-2xl shadow-primary/20">
							<Presentation className="w-16 h-16 text-primary-foreground" />
						</div>
					</div>
				</motion.div>

				{/* Loading Text */}
				<motion.h2
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
				>
					Loading presentation
				</motion.h2>

				{/* Spinner */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="flex items-center justify-center gap-2 text-muted-foreground"
				>
					<Loader2 className="w-5 h-5 animate-spin" />
					<span className="text-sm">Please wait...</span>
				</motion.div>

				{/* Animated Dots */}
				<div className="flex justify-center gap-2 mt-8">
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 1, 0.3],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								delay: i * 0.2,
							}}
							className="w-2 h-2 rounded-full bg-primary"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
