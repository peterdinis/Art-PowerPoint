"use client";

import { Loader2, Presentation } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingProps {
	message?: string;
	fullScreen?: boolean;
	size?: "sm" | "md" | "lg";
}

export function Loading({
	message = "Loading...",
	fullScreen = false,
	size = "md",
}: LoadingProps) {
	const sizeClasses = {
		sm: "w-6 h-6",
		md: "w-12 h-12",
		lg: "w-16 h-16",
	};

	const textSizeClasses = {
		sm: "text-sm",
		md: "text-base",
		lg: "text-xl",
	};

	const containerClasses = fullScreen
		? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
		: "flex items-center justify-center p-8";

	return (
		<div className={containerClasses}>
			<div className="flex flex-col items-center gap-4">
				{/* Animated Icon */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="relative"
				>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					>
						<Loader2 className={`${sizeClasses[size]} text-primary`} />
					</motion.div>

					{/* Presentation Icon in Center */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<Presentation
							className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-primary/50`}
						/>
					</motion.div>
				</motion.div>

				{/* Loading Text */}
				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1 }}
					className="text-center"
				>
					<p className={`${textSizeClasses[size]} font-medium text-foreground`}>
						{message}
					</p>
					<motion.div
						className="flex gap-1 justify-center mt-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								className="w-1.5 h-1.5 bg-primary rounded-full"
								animate={{
									scale: [1, 1.5, 1],
									opacity: [0.5, 1, 0.5],
								}}
								transition={{
									duration: 1,
									repeat: Infinity,
									delay: i * 0.2,
								}}
							/>
						))}
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
