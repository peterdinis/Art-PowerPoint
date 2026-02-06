"use client";

import { useRef } from "react";
import { usePresentationStore } from "@/lib/store/presentationStore";
import SlideElement from "./SlideElement";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function EditorCanvas() {
	const {
		currentPresentation,
		currentSlideIndex,
		selectedElementId,
		selectElement,
		updateElement,
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
					]?.elements.find((el) => el.id === item.id);
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

	if (!currentPresentation) return null;

	const currentSlide = currentPresentation.slides[currentSlideIndex];
	if (!currentSlide) return null;

	return (
		<div className="flex items-center justify-center h-full p-4 lg:p-8 overflow-auto">
			<div className="relative w-full max-w-full flex items-center justify-center">
				<div
					ref={dropRef}
					className={cn(
						"relative shadow-2xl rounded-xl overflow-hidden mx-auto transition-all",
						"w-full max-w-[960px] aspect-video border-2",
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
					{currentSlide.elements.map((element) => (
						<SlideElement
							key={element.id}
							element={element}
							isSelected={selectedElementId === element.id}
							onSelect={() => selectElement(element.id)}
						/>
					))}

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
									<p className="text-lg font-medium">Začnite pridaním obsahu</p>
									<p className="text-sm text-muted-foreground max-w-md">
										Kliknite na tlačidlo "Pridať" v paneli nástrojov alebo
										použite rýchle tlačidlá
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Slide Counter */}
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
					<div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
						<span className="text-sm font-medium text-foreground">
							{currentSlideIndex + 1} / {currentPresentation.slides.length}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
