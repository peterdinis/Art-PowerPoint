"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePresentationStore } from "@/store/presentationStore";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingPresentation } from "@/components/ui/LoadingPresentation";
import { cn } from "@/lib/utils";
import type { SlideElement, GradientStop } from "@/types/presentation";
import IconElement from "@/components/elements/IconElement";
import TableElement from "@/components/elements/TableElement";
import CodeElement from "@/components/elements/CodeElement";
import ChartElement from "@/components/elements/ChartElement";

export default function PresentationPage() {
	const params = useParams();
	const router = useRouter();
	const { presentations, loadPresentations } = usePresentationStore();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

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
				// Wait a bit for presentations to load
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

	const nextSlide = useCallback(() => {
		if (presentation && currentSlideIndex < presentation.slides.length - 1) {
			setCurrentSlideIndex((prev) => prev + 1);
		}
	}, [presentation, currentSlideIndex]);

	const prevSlide = useCallback(() => {
		if (currentSlideIndex > 0) {
			setCurrentSlideIndex((prev) => prev - 1);
		}
	}, [currentSlideIndex]);

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {
				// Ignore errors
			});
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, []);

	const exitFullscreen = useCallback(() => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, []);

	useEffect(() => {
		if (!presentation) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === " ") {
				e.preventDefault();
				nextSlide();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				prevSlide();
			} else if (e.key === "Escape") {
				exitFullscreen();
			} else if (e.key === "f" || e.key === "F") {
				toggleFullscreen();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [presentation, nextSlide, prevSlide, exitFullscreen, toggleFullscreen]);

	useEffect(() => {
		if (isPlaying && presentation) {
			const interval = setInterval(() => {
				setCurrentSlideIndex((prev) => {
					if (prev < presentation.slides.length - 1) {
						return prev + 1;
					} else {
						setIsPlaying(false);
						return prev;
					}
				});
			}, 5000);

			return () => clearInterval(interval);
		}
	}, [isPlaying, presentation]);

	useEffect(() => {
		if (!isFullscreen) return;

		const handleMouseMove = () => {
			setShowControls(true);
			const timeout = setTimeout(() => setShowControls(false), 3000);
			return () => clearTimeout(timeout);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [isFullscreen]);

	if (isLoading) {
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

	return (
		<div className="fixed inset-0 bg-black z-50 overflow-hidden">
			{/* Slide */}
			<div
				className={cn(
					"w-full h-full flex items-center justify-center transition-all",
					transitionClass === "fade" && "opacity-100",
					transitionClass === "slide" && "transform translate-x-0",
					transitionClass === "zoom" && "scale-100",
					transitionClass === "blur" && "blur-0",
				)}
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
			>
				{currentSlide.elements.map((element) => (
					<PresentationElement
						key={element.id}
						element={element}
						slideIndex={currentSlideIndex}
						slideBackground={currentSlide.background}
					/>
				))}
			</div>

			{/* Controls */}
			<div
				className={cn(
					"absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white transition-opacity duration-300",
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
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsPlaying(!isPlaying)}
							className="text-white hover:bg-white/20"
						>
							{isPlaying ? (
								<Pause className="w-5 h-5" />
							) : (
								<Play className="w-5 h-5" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={nextSlide}
							disabled={currentSlideIndex === presentation.slides.length - 1}
							className="text-white hover:bg-white/20 disabled:opacity-50"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
						<span className="text-sm ml-4">
							{currentSlideIndex + 1} / {presentation.slides.length}
						</span>
					</div>
					<div className="flex items-center gap-2">
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
							onClick={() => router.push(`/editor?id=${presentation.id}`)}
							className="text-white hover:bg-white/20"
							title="Close"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Slide indicator */}
			<div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
				{currentSlideIndex + 1} / {presentation.slides.length}
			</div>
		</div>
	);
}

function PresentationElement({
	element,
	slideIndex,
	slideBackground,
}: {
	element: SlideElement;
	slideIndex: number;
	slideBackground?: { color?: string; gradient?: string; image?: string };
}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(false);
		const delay = element.animation?.delay || 0;
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [element.animation?.delay, slideIndex, element.id]);

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

	// Calculate responsive position and size based on viewport
	const viewportWidth =
		typeof window !== "undefined" ? window.innerWidth : 1920;
	const viewportHeight =
		typeof window !== "undefined" ? window.innerHeight : 1080;
	const scaleX = viewportWidth / 1920;
	const scaleY = viewportHeight / 1080;
	const scale = Math.min(scaleX, scaleY);

	const style: React.CSSProperties = {
		position: "absolute",
		left: `${(element.position.x / 960) * 100}%`,
		top: `${(element.position.y / 540) * 100}%`,
		width: `${(element.size.width / 960) * 100}%`,
		height: `${(element.size.height / 540) * 100}%`,
		animationDuration: `${duration}ms`,
		...element.style,
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
			case "text":
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
							fontSize: `${(element.style?.fontSize || 24) * scale}px`,
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
			case "image":
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
			case "shape":
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
					return (
						<div
							style={{
								width: 0,
								height: 0,
								borderLeft: `${((element.size.width / 1920) * viewportWidth) / 2}px solid transparent`,
								borderRight: `${((element.size.width / 1920) * viewportWidth) / 2}px solid transparent`,
								borderBottom: `${(element.size.height / 1080) * viewportHeight}px solid ${element.style?.backgroundColor || "#3b82f6"}`,
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
									fontSize:
										Math.min(
											element.size.width * scaleX,
											element.size.height * scaleY,
										) * 0.8,
									...shapeFilters,
								}}
							>
								❤️
							</div>
						</div>
					);
				}

				return <div style={shapeStyle} />;
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

	return (
		<div style={style} className={cn("select-none", getAnimationClass())}>
			{renderContent()}
		</div>
	);
}
