"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePresentationStore } from "@/lib/store/presentationStore";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import type { SlideElement } from "@/lib/types/presentation";

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
	}, [currentSlideIndex, presentation]);

	useEffect(() => {
		if (isPlaying && presentation) {
			const interval = setInterval(() => {
				if (currentSlideIndex < presentation.slides.length - 1) {
					setCurrentSlideIndex((prev) => prev + 1);
				} else {
					setIsPlaying(false);
				}
			}, 5000);

			return () => clearInterval(interval);
		}
	}, [isPlaying, currentSlideIndex, presentation]);

	useEffect(() => {
		const handleMouseMove = () => {
			setShowControls(true);
			const timeout = setTimeout(() => setShowControls(false), 3000);
			return () => clearTimeout(timeout);
		};

		if (isFullscreen) {
			window.addEventListener("mousemove", handleMouseMove);
			return () => window.removeEventListener("mousemove", handleMouseMove);
		}
	}, [isFullscreen]);

	const nextSlide = () => {
		if (presentation && currentSlideIndex < presentation.slides.length - 1) {
			setCurrentSlideIndex((prev) => prev + 1);
		}
	};

	const prevSlide = () => {
		if (currentSlideIndex > 0) {
			setCurrentSlideIndex((prev) => prev - 1);
		}
	};

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {
				// Ignore errors
			});
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	const exitFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	if (isLoading) {
		return <Loading message="Loading presentation" fullScreen size="lg" />;
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
					backgroundColor: currentSlide.background?.gradient
						? undefined
						: currentSlide.background?.color || "#ffffff",
					background: currentSlide.background?.gradient || undefined,
					backgroundImage: currentSlide.background?.image
						? `url(${currentSlide.background.image})`
						: undefined,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{currentSlide.elements.map((element) => (
					<PresentationElement
						key={element.id}
						element={element}
						slideIndex={currentSlideIndex}
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
}: {
	element: SlideElement;
	slideIndex: number;
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
			case "text":
				return (
					<div
						style={{
							width: "100%",
							height: "100%",
							padding: "8px",
							fontSize: `${(element.style?.fontSize || 16) * scale}px`,
							color: element.style?.color || "#000000",
							fontFamily: element.style?.fontFamily || "Arial",
							fontWeight: element.style?.fontWeight || "normal",
							fontStyle: element.style?.fontStyle || "normal",
							textDecoration: element.style?.textDecoration || "none",
							textAlign: element.style?.textAlign || "left",
							display: "flex",
							alignItems: "center",
							overflow: "hidden",
						}}
					>
						{element.content || "Text"}
					</div>
				);
			case "image":
				return (
					<img
						src={element.content}
						alt=""
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = "none";
						}}
					/>
				);
			case "shape":
				const shapeType = element.content || "square";
				const shapeStyle: React.CSSProperties = {
					width: "100%",
					height: "100%",
					backgroundColor: element.style?.backgroundColor || "#3b82f6",
					border: `${element.style?.borderWidth || 0}px solid ${
						element.style?.borderColor || "#000000"
					}`,
				};

				if (shapeType === "circle") {
					shapeStyle.borderRadius = "50%";
				} else if (shapeType === "triangle") {
					shapeStyle.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
				} else if (shapeType === "rounded") {
					shapeStyle.borderRadius = "12px";
				} else if (shapeType === "star") {
					shapeStyle.clipPath =
						"polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
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
