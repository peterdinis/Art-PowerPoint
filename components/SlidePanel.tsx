"use client";

import { usePresentationStore } from "@/lib/store/presentationStore";
import { Plus, Trash2, Copy, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableSlideProps {
	slide: any;
	index: number;
	isSelected: boolean;
	onSelect: () => void;
	onDuplicate: () => void;
	onDelete: () => void;
	style?: React.CSSProperties;
}

function SortableSlideItem({
	slide,
	index,
	isSelected,
	onSelect,
	onDuplicate,
	onDelete,
	style: virtualStyle,
}: SortableSlideProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: slide.id });

	const style = {
		...virtualStyle,
		transform: transform
			? `${virtualStyle?.transform || ""} ${CSS.Translate.toString(transform)}`
			: virtualStyle?.transform,
		transition,
		zIndex: isDragging ? 50 : 1,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="px-4 py-3"
		>
			<Card
				className={cn(
					"relative group cursor-pointer overflow-hidden transition-all h-full bg-card",
					isSelected
						? "border-primary ring-2 ring-primary/20"
						: "border-border hover:border-primary/50",
				)}
				onClick={onSelect}
			>
				{/* Slide Thumbnail */}
				<div
					className="aspect-video bg-background relative h-full"
					style={{
						backgroundColor: slide.background?.color || "var(--background)",
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
					{/* Drag Handle */}
					<div
						{...attributes}
						{...listeners}
						className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 bg-background/90 backdrop-blur-sm rounded-md"
					>
						<GripVertical className="w-4 h-4 text-muted-foreground" />
					</div>

					{/* Preview of elements */}
					<div className="absolute inset-0 p-2 pointer-events-none">
						{slide.elements.slice(0, 3).map((el: any) => (
							<div
								key={el.id}
								className="absolute bg-primary/20 border border-primary/40 rounded"
								style={{
									left: `${(el.position.x / 960) * 100}%`,
									top: `${(el.position.y / 540) * 100}%`,
									width: `${(el.size.width / 960) * 100}%`,
									height: `${(el.size.height / 540) * 100}%`,
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
							{slide.elements.length} element{slide.elements.length !== 1 ? "s" : ""}
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
								onDuplicate();
							}}
							title="Duplicate"
						>
							<Copy className="w-3.5 h-3.5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-7 w-7 bg-background/95 hover:bg-destructive hover:text-destructive-foreground"
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							title="Delete"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	if (!currentPresentation) return null;

	const slides = currentPresentation.slides;
	const slideIds = useMemo(() => slides.map(s => s.id), [slides]);

	const virtualizer = useVirtualizer({
		count: slides.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 176,
		overscan: 5,
	});

	const virtualItems = virtualizer.getVirtualItems();

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = slides.findIndex((s) => s.id === active.id);
			const newIndex = slides.findIndex((s) => s.id === over.id);
			reorderSlides(oldIndex, newIndex);
		}
	};

	return (
		<div className="w-72 bg-background border-r border-border flex flex-col h-full">
			<div className="p-4 border-b border-border bg-muted/50 shrink-0">
				<div className="flex items-center justify-between mb-3">
					<h2 className="font-semibold text-foreground text-lg italic tracking-tight">Slides</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={addSlide}
						title="Add slide"
						className="hover:bg-primary/10 hover:text-primary transition-colors"
					>
						<Plus className="w-5 h-5" />
					</Button>
				</div>
				<div className="flex items-center justify-between">
					<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
						{slides.length} slide{slides.length !== 1 ? "s" : ""}
					</p>
					<div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary/40 rounded-full transition-all duration-500"
							style={{ width: `${Math.min(100, (slides.length / 20) * 100)}%` }}
						/>
					</div>
				</div>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div
					ref={parentRef}
					className="flex-1 overflow-y-auto relative slide-panel-scroll"
					style={{ contain: "strict" }}
				>
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							position: "relative",
						}}
					>
						<SortableContext
							items={slideIds}
							strategy={verticalListSortingStrategy}
						>
							{virtualItems.map((virtualItem) => {
								const index = virtualItem.index;
								const slide = slides[index];

								return (
									<SortableSlideItem
										key={slide.id}
										slide={slide}
										index={index}
										isSelected={index === currentSlideIndex}
										onSelect={() => selectSlide(index)}
										onDuplicate={() => duplicateSlide(slide.id)}
										onDelete={() => {
											if (confirm("Are you sure you want to delete this slide?")) {
												deleteSlide(slide.id);
											}
										}}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: `${virtualItem.size}px`,
											transform: `translateY(${virtualItem.start}px)`,
										}}
									/>
								);
							})}
						</SortableContext>
					</div>
				</div>
			</DndContext>

			<style jsx global>{`
				.slide-panel-scroll {
					scroll-behavior: smooth;
				}
				.slide-panel-scroll::-webkit-scrollbar {
					width: 4px;
				}
				.slide-panel-scroll::-webkit-scrollbar-track {
					background: transparent;
				}
				.slide-panel-scroll::-webkit-scrollbar-thumb {
					background: color-mix(in srgb, var(--muted-foreground), transparent 80%);
					border-radius: 10px;
				}
				.slide-panel-scroll::-webkit-scrollbar-thumb:hover {
					background: color-mix(in srgb, var(--primary), transparent 70%);
				}
			`}</style>
		</div>
	);
}
