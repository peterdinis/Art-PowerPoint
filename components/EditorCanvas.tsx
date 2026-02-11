"use client";

import { useRef } from "react";
import { usePresentationStore } from "@/lib/store/presentationStore";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import ChartElement from "./elements/ChartElement";
import SlideElement from "./SlideElement";

export default function EditorCanvas() {
	const {
		currentPresentation,
		currentSlideIndex,
		selectedElementId,
		selectElement,
		updateElement,
		previousSlide,
		nextSlide,
	} = usePresentationStore();
	const dropRef = useRef<HTMLDivElement>(null);

	const [{ isOver }, drop] = useDrop({
		accept: "element",
		drop: (item: { id: string }, monitor) => {
			if (!monitor.didDrop() && currentPresentation && dropRef.current) {
				const delta = monitor.getDifferenceFromInitialOffset();
				if (delta) {
					const element = currentPresentation.slides[
						currentSlideIndex
					]?.elements.find((el: { id: string; }) => el.id === item.id);
					if (element) {
						const slideElement = dropRef.current;
						const rect = slideElement.getBoundingClientRect();
						const scaleX = rect.width / 960;
						const scaleY = rect.height / 540;

						const newX = Math.max(
							0,
							Math.min(
								960 - element.size.width,
								element.position.x + delta.x / scaleX,
							),
						);
						const newY = Math.max(
							0,
							Math.min(
								540 - element.size.height,
								element.position.y + delta.y / scaleY,
							),
						);

						updateElement(item.id, {
							position: { x: newX, y: newY },
						});
					}
				}
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	});

	drop(dropRef);

	const handleElementResize = (
		elementId: string,
		width: number,
		height: number,
	) => {
		updateElement(elementId, {
			size: { width, height },
		});
	};

	if (!currentPresentation) return null;

	const currentSlide = currentPresentation.slides[currentSlideIndex];
	if (!currentSlide) return null;

	// Funkcie pre navigáciu slides pomocou klávesnice
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") {
			previousSlide();
		} else if (e.key === "ArrowRight") {
			nextSlide();
		}
	};

	return (
		<div 
			className="flex items-center justify-center h-full p-4 lg:p-8 overflow-auto"
			tabIndex={0}
			onKeyDown={handleKeyDown}
		>
			<div className="relative w-full max-w-full flex items-center justify-center">
				{/* Left Navigation Arrow */}
				{currentSlideIndex > 0 && (
					<button
						onClick={previousSlide}
						className="absolute left-0 md:-left-4 lg:-left-8 z-20 group"
						aria-label="Previous slide"
						title="Previous slide (← Arrow Left)"
					>
						<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<div className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg group-hover:shadow-xl transition-all hover:scale-110">
								<ChevronLeft className="w-6 h-6 text-foreground group-hover:text-primary" />
							</div>
							<div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
								<span className="text-sm font-medium">Previous</span>
							</div>
						</div>
					</button>
				)}

				<div
					ref={dropRef}
					className={cn(
						"relative shadow-2xl rounded-xl overflow-hidden mx-auto transition-all",
						"w-full max-w-240 aspect-video border-2",
						isOver
							? "border-primary ring-4 ring-primary/20 scale-[1.01]"
							: "border-border/50",
						currentSlide.elements.length === 0 && "border-dashed",
					)}
					style={{
						width: "100%",
						maxWidth: "960px",
						aspectRatio: "16/9",
						backgroundColor: currentSlide.background?.gradient
							? undefined
							: currentSlide.background?.color || "hsl(var(--background))",
						background: currentSlide.background?.gradient
							? currentSlide.background.gradient
							: undefined,
						backgroundImage: currentSlide.background?.image
							? `url(${currentSlide.background.image})`
							: undefined,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
					onClick={(e) => {
						if (
							e.target === e.currentTarget ||
							(e.target as HTMLElement).classList.contains("slide-background")
						) {
							selectElement(null);
						}
					}}
				>
					{currentSlide.elements.map((element: any) => {
						if (element.type === "chart") {
							return (
								<ChartElement
									key={element.id}
									element={element}
									isSelected={selectedElementId === element.id}
								/>
							);
						}

						return (
							<SlideElement
								key={element.id}
								element={element}
								isSelected={selectedElementId === element.id}
								onSelect={() => selectElement(element.id)}
								onResize={(width, height) =>
									handleElementResize(element.id, width, height)
								}
							/>
						);
					})}

					{currentSlide.elements.length === 0 && (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
							<div className="flex flex-col items-center gap-4 p-8">
								<div className="relative">
									<div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
									<div className="relative bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary/30 rounded-full p-6">
										<Sparkles className="w-12 h-12 text-primary/60" />
									</div>
								</div>
								<div className="text-center space-y-2">
									<p className="text-lg font-medium">Start by adding content</p>
									<p className="text-sm text-muted-foreground max-w-md">
										Click the "Add" button in the toolbar or use the quick
										action buttons
									</p>
									<p className="text-xs text-muted-foreground mt-4">
										Use ← → arrows to navigate between slides
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Right Navigation Arrow */}
				{currentSlideIndex < currentPresentation.slides.length - 1 && (
					<button
						onClick={nextSlide}
						className="absolute right-0 md:-right-4 lg:-right-8 z-20 group"
						aria-label="Next slide"
						title="Next slide (→ Arrow Right)"
					>
						<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
								<span className="text-sm font-medium">Next</span>
							</div>
							<div className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg group-hover:shadow-xl transition-all hover:scale-110">
								<ChevronRight className="w-6 h-6 text-foreground group-hover:text-primary" />
							</div>
						</div>
					</button>
				)}

				{/* Slide Counter */}
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
					<div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
						<span className="text-sm font-medium text-foreground">
							{currentSlideIndex + 1} / {currentPresentation.slides.length}
						</span>
					</div>
				</div>

				{/* Keyboard Navigation Hint */}
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
					<div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-1 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								<kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
								<span className="text-xs text-muted-foreground">Prev</span>
							</div>
							<div className="w-px h-4 bg-border"></div>
							<div className="flex items-center gap-1">
								<span className="text-xs text-muted-foreground">Next</span>
								<kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}