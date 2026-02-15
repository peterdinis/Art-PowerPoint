"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollToTopProps {
	threshold?: number; // Pixel threshold to show button (default: 300)
	showAtBottom?: boolean; // Show button when at bottom of page
	bottomOffset?: number; // Offset from bottom to consider "at bottom"
	className?: string;
}

export function ScrollToTop({
	threshold = 300,
	showAtBottom = true,
	bottomOffset = 100,
	className,
}: ScrollToTopProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Check scroll position from top
			const scrollY = window.scrollY;
			const shouldShow = scrollY > threshold;

			// Check if at bottom
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollPosition = scrollY + windowHeight;
			const atBottom = scrollPosition >= documentHeight - bottomOffset;

			setIsAtBottom(atBottom);

			if (showAtBottom) {
				setIsVisible(shouldShow || atBottom);
			} else {
				setIsVisible(shouldShow);
			}
		};

		// Initial check
		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold, showAtBottom, bottomOffset]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const scrollToBottom = () => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: "smooth",
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.5, y: 20 }}
					transition={{ duration: 0.2 }}
					className={cn(
						"fixed bottom-6 right-6 z-50 flex flex-col gap-2",
						className,
					)}
				>
					{isAtBottom && showAtBottom ? (
						<Button
							onClick={scrollToTop}
							size="icon"
							className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
							title="Scroll to top"
						>
							<ArrowUp className="h-5 w-5" />
						</Button>
					) : (
						<Button
							onClick={scrollToTop}
							size="icon"
							className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
							title="Scroll to top"
						>
							<ArrowUp className="h-5 w-5" />
						</Button>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Alternatívna verzia s progress barom
interface ScrollToTopWithProgressProps {
	threshold?: number;
	showProgress?: boolean;
	className?: string;
}

export function ScrollToTopWithProgress({
	threshold = 300,
	showProgress = true,
	className,
}: ScrollToTopWithProgressProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			// Calculate scroll progress percentage
			const maxScroll = documentHeight - windowHeight;
			const progress = (scrollY / maxScroll) * 100;
			setScrollProgress(Math.min(100, Math.max(0, progress)));

			// Show/hide button
			setIsVisible(scrollY > threshold);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{ duration: 0.2 }}
					className={cn("fixed bottom-6 right-6 z-50", className)}
				>
					<div className="relative">
						{showProgress && (
							<svg
								className="absolute -inset-1 -rotate-90"
								width="48"
								height="48"
								viewBox="0 0 48 48"
							>
								<circle
									cx="24"
									cy="24"
									r="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									className="text-muted-foreground/20"
								/>
								<circle
									cx="24"
									cy="24"
									r="20"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeDasharray={`${2 * Math.PI * 20}`}
									strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
									className="text-primary transition-all duration-100"
									strokeLinecap="round"
								/>
							</svg>
						)}
						<Button
							onClick={scrollToTop}
							size="icon"
							className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow relative z-10"
							title="Scroll to top"
						>
							<ArrowUp className="h-5 w-5" />
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Jednoduchá verzia bez animácií
export function SimpleScrollToTop({
	threshold = 300,
	className,
}: ScrollToTopProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > threshold);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!isVisible) return null;

	return (
		<Button
			onClick={scrollToTop}
			size="icon"
			className={cn(
				"fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow",
				className,
			)}
			title="Scroll to top"
		>
			<ArrowUp className="h-5 w-5" />
		</Button>
	);
}

// Komponent s možnosťou scroll to top aj bottom
interface ScrollToTopWithBottomProps extends ScrollToTopProps {
	showBottom?: boolean;
}

export function ScrollToTopWithBottom({
	threshold = 300,
	showBottom = true,
	className,
}: ScrollToTopWithBottomProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [showTop, setShowTop] = useState(false);
	const [showBottomBtn, setShowBottomBtn] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			// Show main button after threshold
			setIsVisible(scrollY > threshold);

			// Show top button when not at top
			setShowTop(scrollY > 100);

			// Show bottom button when not at bottom
			const atBottom = scrollY + windowHeight >= documentHeight - 100;
			setShowBottomBtn(!atBottom && showBottom);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold, showBottom]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const scrollToBottom = () => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: "smooth",
		});
	};

	if (!isVisible) return null;

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			className={cn(
				"fixed bottom-6 right-6 z-50 flex flex-col gap-2",
				className,
			)}
		>
			{showTop && (
				<Button
					onClick={scrollToTop}
					size="icon"
					variant="secondary"
					className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
					title="Scroll to top"
				>
					<ArrowUp className="h-5 w-5" />
				</Button>
			)}
			{showBottomBtn && (
				<Button
					onClick={scrollToBottom}
					size="icon"
					variant="secondary"
					className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
					title="Scroll to bottom"
				>
					<ArrowDown className="h-5 w-5" />
				</Button>
			)}
		</motion.div>
	);
}

// Helper komponent pre ArrowDown (ak nie je v lucide-react)
const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 5v14" />
		<path d="m19 12-7 7-7-7" />
	</svg>
);
