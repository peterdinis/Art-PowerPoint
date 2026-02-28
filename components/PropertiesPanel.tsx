"use client";

import { usePresentationStore } from "@/store/presentationStore";
import {
	Trash2,
	Type,
	Image as ImageIcon,
	Square,
	Layers,
	Video,
	Table2,
	Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import type { SlideElement } from "@/types/presentation";

import SlideBackgroundEditor from "./SlideBackgroundEditor";
import { SlideNotesEditor } from "./SlideNotesEditor";

import { LayoutProperties } from "./properties/LayoutProperties";
import { TextProperties } from "./properties/TextProperties";
import { MediaProperties } from "./properties/MediaProperties";
import { ShapeProperties } from "./properties/ShapeProperties";
import { TableProperties } from "./properties/TableProperties";
import { AnimationProperties } from "./properties/AnimationProperties";

export default function PropertiesPanel() {
	const {
		currentPresentation,
		currentSlideIndex,
		selectedElementId,
		updateElement,
		deleteElement,
		selectElement,
		updatePresentation,
	} = usePresentationStore();
	const { theme } = useTheme();

	const getDefaultTextColor = () => {
		if (typeof window === "undefined") return "#212121";
		const isDark = document.documentElement.classList.contains("dark");
		return isDark ? "#e5e5e5" : "#212121";
	};

	if (!currentPresentation) return null;

	const currentSlide = currentPresentation.slides[currentSlideIndex];
	if (!currentSlide) return null;

	const selectedElement = selectedElementId
		? currentSlide.elements.find((el) => el.id === selectedElementId)
		: undefined;

	const handleUpdate = (updates: Partial<SlideElement>) => {
		if (!selectedElement) return;

		const updateData: Partial<SlideElement> = { ...updates };

		if (updates.style) {
			updateData.style = {
				...(selectedElement.style || {}),
				...updates.style,
			};
		}

		if (updates.animation) {
			updateData.animation = {
				...(selectedElement.animation || { type: "none", duration: 500 }),
				...updates.animation,
			};
		}

		updateElement(selectedElement.id, updateData);
	};

	const handleSlideBackgroundUpdate = (updates: {
		color?: string;
		image?: string;
		gradient?: string;
	}) => {
		const updatedSlides = currentPresentation.slides.map((slide, index) =>
			index === currentSlideIndex
				? {
					...slide,
					background: {
						...(slide.background || { type: "color", color: "#ffffff" }),
						...updates,
					},
				}
				: slide,
		);
		updatePresentation(currentPresentation.id, { slides: updatedSlides });
	};

	if (!selectedElement) {
		return (
			<motion.div
				initial={{ x: 320, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="w-80 bg-background border-l border-border flex flex-col h-full min-h-0 max-h-screen overflow-hidden"
			>
				<CardHeader className="flex-none shrink-0">
					<CardTitle className="flex items-center gap-2">
						<Layers className="w-5 h-5" />
						Slide Properties
					</CardTitle>
				</CardHeader>
				<ScrollArea className="flex-1 min-h-0">
					<CardContent className="space-y-6 pb-8">
						<p className="text-sm text-muted-foreground">
							Select an element to edit its properties or use the settings below for this slide.
						</p>

						<SlideBackgroundEditor
							currentBackground={currentSlide.background || { type: "color", color: "#ffffff" }}
							onUpdate={handleSlideBackgroundUpdate}
						/>

						<Separator />

						<div className="space-y-3">
							<Label className="flex items-center gap-2 font-semibold">
								<Type className="h-4 w-4" /> Slide Notes
							</Label>
							<SlideNotesEditor
								content={currentSlide.notes || ""}
								onChange={(html) => {
									const updatedSlides = currentPresentation.slides.map((s, i) =>
										i === currentSlideIndex ? { ...s, notes: html } : s
									);
									updatePresentation(currentPresentation.id, { slides: updatedSlides });
								}}
							/>
						</div>

						<Separator />

						<div className="space-y-3">
							<Label htmlFor="slide-transition" className="font-semibold">Slide Transition</Label>
							<Select
								value={currentSlide.transition?.type || "fade"}
								onValueChange={(val: any) => {
									const updatedSlides = currentPresentation.slides.map((s, i) =>
										i === currentSlideIndex ? { ...s, transition: { ...s.transition, type: val, duration: 500 } } : s
									);
									updatePresentation(currentPresentation.id, { slides: updatedSlides });
								}}
							>
								<SelectTrigger id="slide-transition">
									<SelectValue placeholder="Select transition" />
								</SelectTrigger>
								<SelectContent>
									{["none", "fade", "slide", "zoom", "blur", "cube", "flip"].map(t => (
										<SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</ScrollArea>
			</motion.div>
		);
	}

	const getElementIcon = () => {
		switch (selectedElement.type) {
			case "text": return <Type className="w-5 h-5" />;
			case "image": return <ImageIcon className="w-5 h-5" />;
			case "shape": return <Square className="w-5 h-5" />;
			case "video": return <Video className="w-5 h-5" />;
			case "table": return <Table2 className="w-5 h-5" />;
			case "code": return <Code className="w-5 h-5" />;
			default: return <Layers className="w-5 h-5" />;
		}
	};

	return (
		<motion.div
			key={selectedElement.id}
			initial={{ x: 320, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="w-80 bg-background border-l border-border flex flex-col h-full min-h-0 max-h-screen overflow-hidden"
		>
			<CardHeader className="flex-none shrink-0 border-b">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						{getElementIcon()}
						<span className="capitalize">{selectedElement.type}</span> Properties
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							if (confirm("Delete this element?")) {
								deleteElement(selectedElement.id);
								selectElement(null);
							}
						}}
					>
						<Trash2 className="w-4 h-4 text-destructive" />
					</Button>
				</div>
			</CardHeader>

			<ScrollArea className="flex-1 min-h-0">
				<CardContent className="space-y-8 py-6">
					<Tabs defaultValue="style">
						<TabsList className="grid w-full grid-cols-2 mb-6">
							<TabsTrigger value="style">Style</TabsTrigger>
							<TabsTrigger value="animation">Animation</TabsTrigger>
						</TabsList>

						<TabsContent value="style" className="space-y-6">
							<LayoutProperties element={selectedElement} onUpdate={handleUpdate} />

							{selectedElement.type === "text" && (
								<>
									<Separator />
									<TextProperties
										element={selectedElement}
										onUpdate={handleUpdate}
										getDefaultTextColor={getDefaultTextColor}
									/>
								</>
							)}

							{(selectedElement.type === "image" || selectedElement.type === "video") && (
								<>
									<Separator />
									<MediaProperties element={selectedElement} onUpdate={handleUpdate} />
								</>
							)}

							{selectedElement.type === "shape" && (
								<>
									<Separator />
									<ShapeProperties element={selectedElement} onUpdate={handleUpdate} />
								</>
							)}

							{selectedElement.type === "table" && (
								<>
									<Separator />
									<TableProperties element={selectedElement} onUpdate={handleUpdate} />
								</>
							)}
						</TabsContent>

						<TabsContent value="animation">
							<AnimationProperties element={selectedElement} onUpdate={handleUpdate} />
						</TabsContent>
					</Tabs>
				</CardContent>
			</ScrollArea>
		</motion.div>
	);
}