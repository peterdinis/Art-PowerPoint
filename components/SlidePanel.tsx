"use client";

import { usePresentationStore } from "@/lib/store/presentationStore";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export default function SlidePanel() {
	const {
		currentPresentation,
		currentSlideIndex,
		selectSlide,
		addSlide,
		deleteSlide,
		duplicateSlide,
		reorderSlides,
	} = usePresentationStore();

	const parentRef = useRef<HTMLDivElement>(null);

	if (!currentPresentation) return null;

	const slides = currentPresentation.slides;

	const handleMoveUp = (index: number) => {
		if (index > 0) {
			reorderSlides(index, index - 1);
		}
	};

	const handleMoveDown = (index: number) => {
		if (index < slides.length - 1) {
			reorderSlides(index, index + 1);
		}
	};

	// Use TanStack Virtual for virtualization
	const virtualizer = useVirtualizer({
		count: slides.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 176, // Estimated height of each slide card (aspect-video + padding)
		overscan: 5,
	});

	const virtualItems = virtualizer.getVirtualItems();

	return (
		<div className="w-72 bg-background border-r border-border flex flex-col h-full">
			<div className="p-4 border-b border-border bg-muted/50 shrink-0">
				<div className="flex items-center justify-between mb-3">
					<h2 className="font-semibold text-foreground text-lg">Slides</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={addSlide}
						title="Add slide"
					>
						<Plus className="w-5 h-5" />
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					{slides.length} slide{slides.length !== 1 ? "s" : ""}
				</p>
			</div>

			<div
				ref={parentRef}
				className="flex-1 overflow-y-auto relative"
				style={{
					contain: "strict", // Improves performance
				}}
			>
				{/* Virtual container with proper height */}
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						position: "relative",
					}}
				>
					{/* Render only visible slides */}
					{virtualItems.map((virtualItem) => {
						const index = virtualItem.index;
						const slide = slides[index];

						return (
							<div
								key={slide.id}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: `${virtualItem.size}px`,
									transform: `translateY(${virtualItem.start}px)`,
								}}
								className="px-4 py-3"
							>
								<Card
									className={cn(
										"relative group cursor-pointer overflow-hidden transition-all h-full",
										index === currentSlideIndex
											? "border-primary ring-2 ring-primary/20"
											: "border-border hover:border-primary/50",
									)}
									onClick={() => selectSlide(index)}
								>
									{/* Slide Thumbnail */}
									<div
										className="aspect-video bg-background relative h-full"
										style={{
											backgroundColor: slide.background?.color || "hsl(var(--background))",
											backgroundImage: (() => {
												const stops = slide.background?.gradientStops && slide.background.gradientStops.length > 0
													? slide.background.gradientStops
														.map((s: any) => `${s.color} ${s.offset}%`)
														.join(", ")
													: slide.background?.gradient;

												const image = slide.background?.image
													? `url(${slide.background.image})`
													: undefined;

												if (stops) {
													const type = slide.background?.gradientType || "linear";
													const angle = slide.background?.gradientAngle || 135;
													const gradient = type === "linear"
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
										{/* Preview of elements */}
										<div className="absolute inset-0 p-2">
											{slide.elements.slice(0, 3).map((el, elIndex) => (
												<div
													key={el.id}
													className="absolute bg-primary/20 border border-primary/40 rounded"
													style={{
														left: `${(el.position.x / 960) * 100}%`,
														top: `${(el.position.y / 540) * 100}%`,
														width: `${(el.size.width / 960) * 100}%`,
														height: `${(el.size.height / 540) * 100}%`,
														fontSize: "8px",
													}}
												/>
											))}
										</div>

										{/* Slide Number Badge */}
										<div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-md">
											{index + 1}
										</div>

										{/* Element Count */}
										{slide.elements.length > 0 && (
											<div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-md">
												{slide.elements.length} element
												{slide.elements.length !== 1 ? "s" : ""}
											</div>
										)}

										{/* Actions */}
										<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
											<Button
												variant="secondary"
												size="icon"
												className="h-7 w-7 bg-background/95 hover:bg-background"
												onClick={(e) => {
													e.stopPropagation();
													duplicateSlide(slide.id);
												}}
												title="Duplicate"
											>
												<Copy className="w-3.5 h-3.5" />
											</Button>
											{slides.length > 1 && (
												<Button
													variant="secondary"
													size="icon"
													className="h-7 w-7 bg-background/95 hover:bg-destructive hover:text-destructive-foreground"
													onClick={(e) => {
														e.stopPropagation();
														if (
															confirm(
																"Are you sure you want to delete this slide?",
															)
														) {
															deleteSlide(slide.id);
														}
													}}
													title="Delete"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</Button>
											)}
										</div>

										{/* Move buttons */}
										<div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
											{index > 0 && (
												<Button
													variant="secondary"
													size="icon"
													className="h-7 w-7 bg-background/95 hover:bg-background"
													onClick={(e) => {
														e.stopPropagation();
														handleMoveUp(index);
													}}
													title="Move up"
												>
													<ChevronUp className="w-3.5 h-3.5" />
												</Button>
											)}
											{index < slides.length - 1 && (
												<Button
													variant="secondary"
													size="icon"
													className="h-7 w-7 bg-background/95 hover:bg-background"
													onClick={(e) => {
														e.stopPropagation();
														handleMoveDown(index);
													}}
													title="Move down"
												>
													<ChevronDown className="w-3.5 h-3.5" />
												</Button>
											)}
										</div>
									</div>
								</Card>
							</div>
						);
					})}
				</div>
			</div>

			{/* Add smooth scroll behavior */}
			<style jsx global>{`
        .slide-panel-scroll {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        .slide-panel-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .slide-panel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .slide-panel-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }
        
        .slide-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
		</div>
	);
}
