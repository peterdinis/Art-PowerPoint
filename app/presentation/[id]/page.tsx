"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePresentationStore } from "@/store/presentationStore";
import {
	X,
	ChevronLeft,
	ChevronRight,
	Play,
	Pause,
	RotateCcw,
	EyeOff,
	Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingPresentation } from "@/components/ui/LoadingPresentation";
import { cn } from "@/lib/utils";
import type { SlideElement, GradientStop } from "@/types/presentation";
import IconElement from "@/components/elements/IconElement";
import TableElement from "@/components/elements/TableElement";
import CodeElement from "@/components/elements/CodeElement";
import ChartElement from "@/components/elements/ChartElement";
import { motion, AnimatePresence } from "framer-motion";

export default function PresentationPage() {
	const [isMounted, setIsMounted] = useState(false);
	const params = useParams();
	const router = useRouter();
	const { presentations, loadPresentations } = usePresentationStore();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [autoPlayInterval, setAutoPlayInterval] = useState(5000);
	const [remainingTime, setRemainingTime] = useState(autoPlayInterval / 1000);
	const intervalRef = useRef<NodeJS.Timeout>(null);
	const timerRef = useRef<NodeJS.Timeout>(null);
	const slideRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const presentationId =
		typeof params.id === "string" ? params.id : params.id?.[0];
	const presentation = presentations.find((p) => p.id === presentationId);

	useEffect(() => {
		loadPresentations();
	}, [loadPresentations]);

	useEffect(() => {
		if (presentations.length > 0) {
			setIsLoading(false);
			if (!presentation && presentationId) {
				const timer = setTimeout(() => {
					const found = presentations.find((p) => p.id === presentationId);
					if (!found) {
						router.push("/");
					}
				}, 500);
				return () => clearTimeout(timer);
			}
		}
	}, [presentations, presentation, presentationId, router]);

	const stopPlaying = useCallback(() => {
		setIsPlaying(false);
		setRemainingTime(autoPlayInterval / 1000);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
	}, [autoPlayInterval]);

	const nextSlide = useCallback(() => {
		if (presentation && currentSlideIndex < presentation.slides.length - 1) {
			setCurrentSlideIndex((prev) => prev + 1);
			setRemainingTime(autoPlayInterval / 1000);
		}
	}, [presentation, currentSlideIndex, autoPlayInterval]);

	const prevSlide = useCallback(() => {
		if (currentSlideIndex > 0) {
			setCurrentSlideIndex((prev) => prev - 1);
			setRemainingTime(autoPlayInterval / 1000);
		}
	}, [currentSlideIndex, autoPlayInterval]);

	const restartPlayFromBeginning = useCallback(() => {
		stopPlaying();
		setCurrentSlideIndex(0);
		setIsPlaying(true);
	}, [stopPlaying]);

	const togglePlayMode = useCallback(() => {
		if (isPlaying) {
			stopPlaying();
		} else {
			setIsPlaying(true);
		}
	}, [isPlaying, stopPlaying]);

	const changeInterval = useCallback((newInterval: number) => {
		setAutoPlayInterval(newInterval);
		setRemainingTime(newInterval / 1000);
	}, []);

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => { });
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, []);

	const returnToEditor = useCallback(() => {
		stopPlaying();
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
		router.push(`/editor?id=${presentation?.id}`);
	}, [presentation?.id, router, stopPlaying]);

	useEffect(() => {
		if (!presentation || !isMounted) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === " ") {
				e.preventDefault();
				nextSlide();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				prevSlide();
			} else if (e.key === "Escape") {
				stopPlaying();
				if (document.fullscreenElement) {
					document.exitFullscreen();
					setIsFullscreen(false);
				}
			} else if (e.key === "f" || e.key === "F") {
				toggleFullscreen();
			} else if (e.key === "p" || e.key === "P") {
				togglePlayMode();
			} else if (e.key === "r" || e.key === "R") {
				restartPlayFromBeginning();
			} else if (e.key === "e" || e.key === "E") {
				e.preventDefault();
				returnToEditor();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [presentation, nextSlide, prevSlide, toggleFullscreen, togglePlayMode, restartPlayFromBeginning, stopPlaying, returnToEditor, isMounted]);

	useEffect(() => {
		if (isPlaying && presentation && isMounted) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}

			setRemainingTime(autoPlayInterval / 1000);
			timerRef.current = setInterval(() => {
				setRemainingTime((prev) => {
					if (prev <= 0.1) {
						return autoPlayInterval / 1000;
					}
					return prev - 0.1;
				});
			}, 100);

			intervalRef.current = setInterval(() => {
				setCurrentSlideIndex((prev) => {
					if (prev < presentation.slides.length - 1) {
						return prev + 1;
					} else {
						stopPlaying();
						return prev;
					}
				});
			}, autoPlayInterval);

			return () => {
				if (intervalRef.current) clearInterval(intervalRef.current);
				if (timerRef.current) clearInterval(timerRef.current);
			};
		}
	}, [isPlaying, presentation, autoPlayInterval, stopPlaying, isMounted]);

	useEffect(() => {
		if (!isFullscreen || !isMounted) return;

		const handleMouseMove = () => {
			setShowControls(true);
			const timeout = setTimeout(() => setShowControls(false), 3000);
			return () => clearTimeout(timeout);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [isFullscreen, isMounted]);

	if (!isMounted || isLoading) {
		return <LoadingPresentation message="Loading presentation..." />;
	}

	if (!presentation) {
		return (
			<div className="flex items-center justify-center h-screen bg-background">
				<div className="text-center">
					<p className="mb-4 text-foreground">Presentation not found</p>
					<Button onClick={() => router.push("/")} variant="outline">
						Back to dashboard
					</Button>
				</div>
			</div>
		);
	}

	if (presentation.slides.length === 0) {
		return (
			<div className="flex items-center justify-center h-screen bg-background">
				<div className="text-center">
					<p className="mb-4 text-foreground">Presentation has no slides</p>
					<Button
						onClick={() => router.push(`/editor?id=${presentation.id}`)}
						variant="outline"
					>
						Back to editor
					</Button>
				</div>
			</div>
		);
	}

	const currentSlide = presentation.slides[currentSlideIndex];
	if (!currentSlide) {
		setCurrentSlideIndex(0);
		return null;
	}

	const transitionClass = currentSlide.transition?.type || "fade";
	const transitionDuration = currentSlide.transition?.duration || 500;

	// Zoradenie elementov podľa z-index pre správne prekrývanie
	const sortedElements = [...currentSlide.elements].sort((a, b) => {
		const zIndexA = a.style?.zIndex || 0;
		const zIndexB = b.style?.zIndex || 0;
		return zIndexA - zIndexB;
	});

	return (
		<div className="fixed inset-0 bg-black z-50 overflow-hidden">
			{/* Slide container */}
			<div
				ref={slideRef}
				className="absolute inset-0"
			>
				{/* Slide background */}
				<div
					className="absolute inset-0 transition-all"
					style={{
						transitionDuration: `${transitionDuration}ms`,
						backgroundColor:
							currentSlide.background?.color || "var(--background)",
						backgroundImage: (() => {
							const stops =
								currentSlide.background?.gradientStops &&
									currentSlide.background.gradientStops.length > 0
									? currentSlide.background.gradientStops
										.map((s) => `${s.color} ${s.offset}%`)
										.join(", ")
									: currentSlide.background?.gradient;

							const image = currentSlide.background?.image
								? `url(${currentSlide.background.image})`
								: undefined;

							if (stops) {
								const type = currentSlide.background?.gradientType || "linear";
								const angle = currentSlide.background?.gradientAngle || 135;
								const gradient =
									type === "linear"
										? `linear-gradient(${angle}deg, ${stops})`
										: `radial-gradient(circle, ${stops})`;

								return image ? `${gradient}, ${image}` : gradient;
							}

							return image;
						})(),
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>

				{/* Slide elements - každý element má vlastný z-index */}
				{sortedElements.map((element) => (
					<PresentationElement
						key={element.id}
						element={element}
						slideIndex={currentSlideIndex}
						slideBackground={currentSlide.background}
						containerRef={slideRef}
					/>
				))}
			</div>

			{/* Overlay UI elements - vyšší z-index aby boli nad obsahom */}
			<div className="absolute inset-0 pointer-events-none z-[100]">
				{/* Auto-play progress indicator */}
				<AnimatePresence>
					{isPlaying && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute top-0 left-0 right-0 h-1 bg-white/20 pointer-events-auto"
						>
							<motion.div
								className="h-full bg-primary"
								initial={{ width: "0%" }}
								animate={{ width: "100%" }}
								transition={{
									duration: autoPlayInterval / 1000,
									ease: "linear",
								}}
								key={currentSlideIndex}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Play mode indicator with timer */}
				<AnimatePresence>
					{isPlaying && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 pointer-events-auto"
						>
							<Play className="w-3 h-3 fill-white" />
							<span>Auto-play</span>
							<span className="font-mono">{remainingTime.toFixed(1)}s</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={stopPlaying}
								className="h-5 w-5 text-white hover:bg-white/20 ml-1"
								title="Stop auto-play (Esc)"
							>
								<X className="w-3 h-3" />
							</Button>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Controls */}
				<div
					className={cn(
						"absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white transition-opacity duration-300 pointer-events-auto",
						showControls ? "opacity-100" : "opacity-0 pointer-events-none",
					)}
				>
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={prevSlide}
								disabled={currentSlideIndex === 0}
								className="text-white hover:bg-white/20 disabled:opacity-50"
								title="Previous slide (←)"
							>
								<ChevronLeft className="w-5 h-5" />
							</Button>

							{/* Play/Pause controls */}
							<Button
								variant="ghost"
								size="icon"
								onClick={togglePlayMode}
								className={cn(
									"text-white hover:bg-white/20",
									isPlaying && "bg-primary/50 hover:bg-primary/70"
								)}
								title={isPlaying ? "Pause (P)" : "Play (P)"}
							>
								{isPlaying ? (
									<Pause className="w-5 h-5" />
								) : (
									<Play className="w-5 h-5" />
								)}
							</Button>

							{/* Restart button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={restartPlayFromBeginning}
								className="text-white hover:bg-white/20"
								title="Restart from beginning (R)"
								disabled={currentSlideIndex === 0 && !isPlaying}
							>
								<RotateCcw className="w-4 h-4" />
							</Button>

							{/* Stop button (visible only in play mode) */}
							<AnimatePresence>
								{isPlaying && (
									<motion.div
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0, opacity: 0 }}
									>
										<Button
											variant="ghost"
											size="icon"
											onClick={stopPlaying}
											className="text-white hover:bg-white/20 bg-red-500/50 hover:bg-red-500/70"
											title="Stop auto-play (Esc)"
										>
											<EyeOff className="w-4 h-4" />
										</Button>
									</motion.div>
								)}
							</AnimatePresence>

							<Button
								variant="ghost"
								size="icon"
								onClick={nextSlide}
								disabled={currentSlideIndex === presentation.slides.length - 1}
								className="text-white hover:bg-white/20 disabled:opacity-50"
								title="Next slide (→ or Space)"
							>
								<ChevronRight className="w-5 h-5" />
							</Button>

							{/* Speed controls for auto-play */}
							<AnimatePresence>
								{isPlaying && (
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										className="flex items-center gap-1 ml-4"
									>
										<span className="text-xs text-white/70 mr-2">Speed:</span>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => changeInterval(3000)}
											className={cn(
												"h-7 w-7 text-xs text-white hover:bg-white/20",
												autoPlayInterval === 3000 && "bg-white/30"
											)}
											title="3 seconds"
										>
											3s
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => changeInterval(5000)}
											className={cn(
												"h-7 w-7 text-xs text-white hover:bg-white/20",
												autoPlayInterval === 5000 && "bg-white/30"
											)}
											title="5 seconds"
										>
											5s
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => changeInterval(8000)}
											className={cn(
												"h-7 w-7 text-xs text-white hover:bg-white/20",
												autoPlayInterval === 8000 && "bg-white/30"
											)}
											title="8 seconds"
										>
											8s
										</Button>
									</motion.div>
								)}
							</AnimatePresence>

							<span className="text-sm ml-4">
								{currentSlideIndex + 1} / {presentation.slides.length}
							</span>
						</div>

						<div className="flex items-center gap-2">
							{/* Return to Editor Button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={returnToEditor}
								className="text-white hover:bg-white/20 bg-blue-500/30 hover:bg-blue-500/50"
								title="Return to editor (E)"
							>
								<Edit className="w-4 h-4" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								onClick={toggleFullscreen}
								className="text-white hover:bg-white/20"
								title="Fullscreen (F)"
							>
								<span className="text-xs">⛶</span>
							</Button>

							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									stopPlaying();
									router.push(`/editor?id=${presentation.id}`);
								}}
								className="text-white hover:bg-white/20"
								title="Close"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</div>

				{/* Slide indicator */}
				<div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm pointer-events-auto">
					{currentSlideIndex + 1} / {presentation.slides.length}
				</div>

				{/* Keyboard shortcuts hint */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: showControls ? 0.5 : 0, y: showControls ? 0 : 20 }}
					className="absolute bottom-24 left-4 text-white/50 text-xs hidden md:block"
				>
					Press <kbd className="px-1 bg-white/20 rounded">P</kbd> play/pause •{' '}
					<kbd className="px-1 bg-white/20 rounded">R</kbd> restart •{' '}
					<kbd className="px-1 bg-white/20 rounded">Esc</kbd> stop •{' '}
					<kbd className="px-1 bg-white/20 rounded">F</kbd> fullscreen •{' '}
					<kbd className="px-1 bg-white/20 rounded">E</kbd> edit
				</motion.div>

				{/* Return to Editor Button - Large version for easy access */}
				<AnimatePresence>
					{!showControls && !isPlaying && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className="absolute top-4 left-4 pointer-events-auto"
						>
							<Button
								onClick={returnToEditor}
								className="bg-blue-500/80 hover:bg-blue-600 text-white shadow-lg"
								size="sm"
							>
								<Edit className="w-4 h-4 mr-2" />
								Edit Presentation
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

function PresentationElement({
	element,
	slideIndex,
	slideBackground,
	containerRef,
}: {
	element: SlideElement;
	slideIndex: number;
	slideBackground?: { color?: string; gradient?: string; image?: string };
	containerRef: React.RefObject<HTMLDivElement | null>;
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		const updateDimensions = () => {
			if (containerRef.current) {
				const { width, height } = containerRef.current.getBoundingClientRect();
				setDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	}, [containerRef, isMounted]);

	useEffect(() => {
		if (!isMounted) return;

		setIsVisible(false);
		const delay = element.animation?.delay || 0;
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [element.animation?.delay, slideIndex, element.id, isMounted]);

	const animationType = element.animation?.type || "none";
	const duration = element.animation?.duration || 500;

	const getAnimationClass = () => {
		if (!isVisible || animationType === "none") return "";

		switch (animationType) {
			case "fadeIn":
				return "animate-fade-in";
			case "slideIn":
				return "animate-slide-in";
			case "zoomIn":
				return "animate-zoom-in";
			case "bounce":
				return "animate-bounce";
			case "rotate":
				return "animate-spin";
			default:
				return "";
		}
	};

	// Výpočet pozície a veľkosti vzhľadom na aktuálny kontajner
	const calculateStyle = (): React.CSSProperties => {
		const baseWidth = 1920;
		const baseHeight = 1080;
		
		const scaleX = dimensions.width / baseWidth;
		const scaleY = dimensions.height / baseHeight;
		const scale = Math.min(scaleX, scaleY);

		// Centrovanie obsahu
		const offsetX = (dimensions.width - baseWidth * scale) / 2;
		const offsetY = (dimensions.height - baseHeight * scale) / 2;

		const left = offsetX + (element.position.x * scale);
		const top = offsetY + (element.position.y * scale);

		return {
			position: "absolute",
			left: `${left}px`,
			top: `${top}px`,
			width: `${element.size.width * scale}px`,
			height: `${element.size.height * scale}px`,
			animationDuration: `${duration}ms`,
			zIndex: element.style?.zIndex || 1,
			...element.style,
		};
	};

	const renderContent = () => {
		switch (element.type) {
			case "chart":
				return <ChartElement element={element} isSelected={false} />;
			case "icon":
				return <IconElement element={element} isSelected={false} />;
			case "table":
				return <TableElement element={element} isSelected={false} />;
			case "code":
				return <CodeElement element={element} isSelected={false} />;
			case "text": {
				const filterStyles = element.style?.filters
					? {
						filter: [
							element.style.filters.blur
								? `blur(${element.style.filters.blur}px)`
								: "",
							element.style.filters.brightness
								? `brightness(${element.style.filters.brightness})`
								: "",
							element.style.filters.contrast
								? `contrast(${element.style.filters.contrast})`
								: "",
							element.style.filters.grayscale
								? `grayscale(${element.style.filters.grayscale})`
								: "",
							element.style.filters.sepia
								? `sepia(${element.style.filters.sepia})`
								: "",
							element.style.filters.hueRotate
								? `hue-rotate(${element.style.filters.hueRotate}deg)`
								: "",
							element.style.filters.saturate
								? `saturate(${element.style.filters.saturate})`
								: "",
							element.style.filters.invert
								? `invert(${element.style.filters.invert})`
								: "",
						].join(" "),
					}
					: {};

				const getBackgroundStyle = () => {
					const style: React.CSSProperties = {
						backgroundColor: element.style?.backgroundColor,
					};

					if (
						element.style?.gradientStops &&
						element.style.gradientStops.length > 0
					) {
						const type = element.style.gradientType || "linear";
						const angle = element.style.gradientAngle || 135;
						const stops = element.style.gradientStops
							.map((s) => `${s.color} ${s.offset}%`)
							.join(", ");

						style.backgroundImage =
							type === "linear"
								? `linear-gradient(${angle}deg, ${stops})`
								: `radial-gradient(circle, ${stops})`;
					}

					return style;
				};

				return (
					<div
						style={{
							width: "100%",
							height: "100%",
							padding: element.style?.padding || "8px",
							fontSize: element.style?.fontSize || 24,
							color: element.style?.color || "var(--foreground)",
							fontFamily: element.style?.fontFamily || "Arial",
							fontWeight: element.style?.fontWeight || "normal",
							fontStyle: element.style?.fontStyle || "normal",
							textDecoration: element.style?.textDecoration || "none",
							textAlign: (element.style?.textAlign as any) || "left",
							...getBackgroundStyle(),
							lineHeight: element.style?.lineHeight,
							letterSpacing: element.style?.letterSpacing,
							borderColor: element.style?.borderColor,
							borderWidth: element.style?.borderWidth,
							borderStyle: element.style?.borderStyle,
							borderRadius: element.style?.borderRadius,
							boxShadow: element.style?.boxShadow,
							opacity: element.style?.opacity,
							whiteSpace: "pre-wrap",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							...filterStyles,
						}}
					>
						{element.content}
					</div>
				);
			}
			case "image": {
				const imageFilters = element.style?.filters
					? {
						filter: [
							element.style.filters.blur
								? `blur(${element.style.filters.blur}px)`
								: "",
							element.style.filters.brightness
								? `brightness(${element.style.filters.brightness})`
								: "",
							element.style.filters.contrast
								? `contrast(${element.style.filters.contrast})`
								: "",
							element.style.filters.grayscale
								? `grayscale(${element.style.filters.grayscale})`
								: "",
							element.style.filters.sepia
								? `sepia(${element.style.filters.sepia})`
								: "",
							element.style.filters.hueRotate
								? `hue-rotate(${element.style.filters.hueRotate}deg)`
								: "",
							element.style.filters.saturate
								? `saturate(${element.style.filters.saturate})`
								: "",
							element.style.filters.invert
								? `invert(${element.style.filters.invert})`
								: "",
						].join(" "),
					}
					: {};

				return (
					<img
						src={element.content}
						alt=""
						style={{
							width: "100%",
							height: "100%",
							borderRadius: element.style?.borderRadius,
							objectFit: (element.style?.objectFit as any) || "cover",
							...imageFilters,
						}}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = "none";
						}}
					/>
				);
			}
			case "shape": {
				const shapeType = element.content || "square";
				const shapeFilters = element.style?.filters
					? {
						filter: [
							element.style.filters.blur
								? `blur(${element.style.filters.blur}px)`
								: "",
							element.style.filters.brightness
								? `brightness(${element.style.filters.brightness})`
								: "",
							element.style.filters.contrast
								? `contrast(${element.style.filters.contrast})`
								: "",
							element.style.filters.grayscale
								? `grayscale(${element.style.filters.grayscale})`
								: "",
							element.style.filters.sepia
								? `sepia(${element.style.filters.sepia})`
								: "",
							element.style.filters.hueRotate
								? `hue-rotate(${element.style.filters.hueRotate}deg)`
								: "",
							element.style.filters.saturate
								? `saturate(${element.style.filters.saturate})`
								: "",
							element.style.filters.invert
								? `invert(${element.style.filters.invert})`
								: "",
						].join(" "),
					}
					: {};

				const shapeStyle: React.CSSProperties = {
					width: "100%",
					height: "100%",
					backgroundColor: element.style?.backgroundColor || "#3b82f6",
					backgroundImage: (() => {
						if (
							element.style?.gradientStops &&
							element.style.gradientStops.length > 0
						) {
							const type = element.style.gradientType || "linear";
							const angle = element.style.gradientAngle || 135;
							const stops = element.style.gradientStops
								.map((s: GradientStop) => `${s.color} ${s.offset}%`)
								.join(", ");

							return type === "linear"
								? `linear-gradient(${angle}deg, ${stops})`
								: `radial-gradient(circle, ${stops})`;
						}
						return undefined;
					})(),
					borderColor: element.style?.borderColor,
					borderWidth: element.style?.borderWidth || 0,
					borderStyle: (element.style?.borderStyle as any) || "solid",
					borderRadius: element.style?.borderRadius || 0,
					boxShadow: element.style?.boxShadow,
					...shapeFilters,
				};

				if (shapeType === "circle") {
					shapeStyle.borderRadius = "50%";
				} else if (shapeType === "triangle") {
					const scale = dimensions.width / 1920;
					return (
						<div
							style={{
								width: 0,
								height: 0,
								borderLeft: `${element.size.width * scale / 2}px solid transparent`,
								borderRight: `${element.size.width * scale / 2}px solid transparent`,
								borderBottom: `${element.size.height * scale}px solid ${element.style?.backgroundColor || "#3b82f6"}`,
								...shapeFilters,
							}}
						/>
					);
				} else if (shapeType === "heart") {
					return (
						<div className="absolute inset-0 flex items-center justify-center">
							<div
								style={{
									color: element.style?.backgroundColor || "#ec4899",
									fontSize: Math.min(element.size.width, element.size.height) * 0.8,
									...shapeFilters,
								}}
							>
								❤️
							</div>
						</div>
					);
				}

				return <div style={shapeStyle} />;
			}
			case "video":
				return (
					<div
						style={{
							width: "100%",
							height: "100%",
							backgroundColor: "#000",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: element.style?.borderRadius || "8px",
						}}
					>
						<p style={{ color: "#fff" }}>Video: {element.content}</p>
					</div>
				);
			default:
				return <div>{element.content}</div>;
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div
			ref={elementRef}
			style={calculateStyle()}
			className={cn(
				"select-none",
				getAnimationClass(),
				element.type === "text" && "overflow-hidden"
			)}
		>
			{renderContent()}
		</div>
	);
}