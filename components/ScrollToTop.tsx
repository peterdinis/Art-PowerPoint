"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Position =
	| "top-left"
	| "top-center"
	| "top-right"
	| "center-left"
	| "center"
	| "center-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

type AxisPosition = {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
	offsetX?: number;
	offsetY?: number;
};

interface ScrollToTopProps {
	threshold?: number; // Pixel threshold to show button (default: 300)
	showAtBottom?: boolean; // Show button when at bottom of page
	bottomOffset?: number; // Offset from bottom to consider "at bottom"
	className?: string;
	position?: Position | AxisPosition; // Pozícia tlačidla
	customOffset?: {
		x?: number;
		y?: number;
	};
}

// Helper funkcia na konverziu pozície na CSS triedy
const getPositionClasses = (
	position: Position | AxisPosition,
	offset?: { x?: number; y?: number },
) => {
	const defaultOffset = { x: 6, y: 6 }; // 1.5rem (6 * 0.25rem = 1.5rem)

	if (typeof position === "object") {
		// Custom pozícia s osami
		const verticalClasses = {
			top: `top-${position.offsetY ?? offset?.y ?? defaultOffset.y}`,
			center: "top-1/2 -translate-y-1/2",
			bottom: `bottom-${position.offsetY ?? offset?.y ?? defaultOffset.y}`,
		};

		const horizontalClasses = {
			left: `left-${position.offsetX ?? offset?.x ?? defaultOffset.x}`,
			center: "left-1/2 -translate-x-1/2",
			right: `right-${position.offsetX ?? offset?.x ?? defaultOffset.x}`,
		};

		return `${verticalClasses[position.vertical]} ${horizontalClasses[position.horizontal]}`;
	}

	// Predefinované pozície
	const positions: Record<Position, string> = {
		"top-left": `top-${offset?.y ?? defaultOffset.y} left-${offset?.x ?? defaultOffset.x}`,
		"top-center": `top-${offset?.y ?? defaultOffset.y} left-1/2 -translate-x-1/2`,
		"top-right": `top-${offset?.y ?? defaultOffset.y} right-${offset?.x ?? defaultOffset.x}`,
		"center-left": "top-1/2 -translate-y-1/2 left-6",
		center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
		"center-right": "top-1/2 -translate-y-1/2 right-6",
		"bottom-left": `bottom-${offset?.y ?? defaultOffset.y} left-${offset?.x ?? defaultOffset.x}`,
		"bottom-center": `bottom-${offset?.y ?? defaultOffset.y} left-1/2 -translate-x-1/2`,
		"bottom-right": `bottom-${offset?.y ?? defaultOffset.y} right-${offset?.x ?? defaultOffset.x}`,
	};

	return positions[position];
};

export function ScrollToTop({
	threshold = 300,
	showAtBottom = true,
	bottomOffset = 100,
	className,
	position = "bottom-right",
	customOffset,
}: ScrollToTopProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const shouldShow = scrollY > threshold;

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

	const positionClasses = getPositionClasses(position, customOffset);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{ duration: 0.2 }}
					className={cn("fixed z-50", positionClasses, className)}
				>
					<Button
						onClick={scrollToTop}
						size="icon"
						className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
						title="Scroll to top"
						variant={isAtBottom ? "default" : "secondary"}
					>
						<ArrowUp className="h-5 w-5" />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Verzia s progress barom
interface ScrollToTopWithProgressProps extends ScrollToTopProps {
	showProgress?: boolean;
	progressSize?: number;
}

export function ScrollToTopWithProgress({
	threshold = 300,
	showProgress = true,
	progressSize = 48,
	className,
	position = "bottom-right",
	customOffset,
}: ScrollToTopWithProgressProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			const maxScroll = documentHeight - windowHeight;
			const progress = (scrollY / maxScroll) * 100;
			setScrollProgress(Math.min(100, Math.max(0, progress)));

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

	const positionClasses = getPositionClasses(position, customOffset);
	const radius = progressSize / 2 - 4;
	const circumference = 2 * Math.PI * radius;

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{ duration: 0.2 }}
					className={cn("fixed z-50", positionClasses, className)}
				>
					<div className="relative">
						{showProgress && (
							<svg
								className="absolute -inset-1 -rotate-90"
								width={progressSize + 8}
								height={progressSize + 8}
								viewBox={`0 0 ${progressSize + 8} ${progressSize + 8}`}
							>
								<circle
									cx={(progressSize + 8) / 2}
									cy={(progressSize + 8) / 2}
									r={radius}
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									className="text-muted-foreground/20"
								/>
								<circle
									cx={(progressSize + 8) / 2}
									cy={(progressSize + 8) / 2}
									r={radius}
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeDasharray={circumference}
									strokeDashoffset={circumference * (1 - scrollProgress / 100)}
									className="text-primary transition-all duration-100"
									strokeLinecap="round"
								/>
							</svg>
						)}
						<Button
							onClick={scrollToTop}
							size="icon"
							className={cn(
								"rounded-full shadow-lg hover:shadow-xl transition-shadow relative z-10",
								progressSize === 48
									? "h-12 w-12"
									: `h-${progressSize / 4} w-${progressSize / 4}`,
							)}
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
	position = "bottom-right",
	customOffset,
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

	const positionClasses = getPositionClasses(position, customOffset);

	return (
		<Button
			onClick={scrollToTop}
			size="icon"
			className={cn(
				"fixed z-50 h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow",
				positionClasses,
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
	position = "bottom-right",
	customOffset,
}: ScrollToTopWithBottomProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [showTop, setShowTop] = useState(false);
	const [showBottomBtn, setShowBottomBtn] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			setIsVisible(scrollY > threshold);
			setShowTop(scrollY > 100);

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

	// Pre komponenty s dvoma tlačidlami použijeme špeciálne pozicovanie
	const getContainerPosition = () => {
		if (typeof position === "object") {
			const verticalClass = {
				top: `top-${position.offsetY ?? customOffset?.y ?? 6}`,
				center: "top-1/2 -translate-y-1/2",
				bottom: `bottom-${position.offsetY ?? customOffset?.y ?? 6}`,
			}[position.vertical];

			const horizontalClass = {
				left: `left-${position.offsetX ?? customOffset?.x ?? 6}`,
				center: "left-1/2 -translate-x-1/2",
				right: `right-${position.offsetX ?? customOffset?.x ?? 6}`,
			}[position.horizontal];

			return `${verticalClass} ${horizontalClass}`;
		}

		const positions: Record<Position, string> = {
			"top-left": `top-${customOffset?.y ?? 6} left-${customOffset?.x ?? 6}`,
			"top-center": `top-${customOffset?.y ?? 6} left-1/2 -translate-x-1/2`,
			"top-right": `top-${customOffset?.y ?? 6} right-${customOffset?.x ?? 6}`,
			"center-left": "top-1/2 -translate-y-1/2 left-6",
			center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
			"center-right": "top-1/2 -translate-y-1/2 right-6",
			"bottom-left": `bottom-${customOffset?.y ?? 6} left-${customOffset?.x ?? 6}`,
			"bottom-center": `bottom-${customOffset?.y ?? 6} left-1/2 -translate-x-1/2`,
			"bottom-right": `bottom-${customOffset?.y ?? 6} right-${customOffset?.x ?? 6}`,
		};

		return positions[position as Position];
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5 }}
			className={cn(
				"fixed z-50 flex flex-col gap-2",
				getContainerPosition(),
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

// Helper komponent pre ArrowDown
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
