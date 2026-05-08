import { useState, useEffect } from "react";
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
	Save,
	RotateCcw,
	Settings,
} from "lucide-react";
import { useTranslate } from "@/lib/useTranslate";
import { useSettingsStore } from "@/store/settingsStore";
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
import { toast } from "sonner";

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
	const { t, language } = useTranslate();

	const [draftElement, setDraftElement] = useState<SlideElement | null>(null);
	const [hasChanges, setHasChanges] = useState(false);

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

	// Initial draft sync when element selection changes
	useEffect(() => {
		if (selectedElement) {
			setDraftElement(JSON.parse(JSON.stringify(selectedElement)));
			setHasChanges(false);
		} else {
			setDraftElement(null);
			setHasChanges(false);
		}
	}, [selectedElementId, selectedElement ? selectedElement.id : null]);

	const handleDraftUpdate = (updates: Partial<SlideElement>) => {
		if (!draftElement) return;

		setDraftElement((prev) => {
			if (!prev) return null;
			const newData = { ...prev, ...updates };

			// Deep merge for style and animation if they exist in updates
			if (updates.style) {
				newData.style = {
					...(prev.style || {}),
					...updates.style,
				};
			}

			if (updates.animation) {
				newData.animation = {
					...(prev.animation || { type: "none", duration: 500 }),
					...updates.animation,
				};
			}

			setHasChanges(true);
			return newData;
		});
	};

	const saveChanges = () => {
		if (!draftElement) return;
		updateElement(draftElement.id, draftElement);
		setHasChanges(false);
		toast.success(language === "sk" ? "Zmeny uložené" : "Changes saved");
	};

	const discardChanges = () => {
		if (selectedElement) {
			setDraftElement(JSON.parse(JSON.stringify(selectedElement)));
			setHasChanges(false);
			toast.info(language === "sk" ? "Zmeny zahodené" : "Changes discarded");
		}
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

	if (!selectedElement || !draftElement) {
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
						{language === "sk" ? "Vlastnosti snímky" : "Slide Properties"}
					</CardTitle>
				</CardHeader>
				<ScrollArea className="flex-1 min-h-0">
					<CardContent className="space-y-6 pb-8">
						<p className="text-sm text-muted-foreground">
							{language === "sk"
								? "Vyberte prvok na úpravu jeho vlastností alebo použite nastavenia nižšie pre túto snímku."
								: "Select an element to edit its properties or use the settings below for this slide."}
						</p>

						<SlideBackgroundEditor
							currentBackground={
								currentSlide.background || { type: "color", color: "#ffffff" }
							}
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
									const updatedSlides = currentPresentation.slides.map(
										(s, i) =>
											i === currentSlideIndex ? { ...s, notes: html } : s,
									);
									updatePresentation(currentPresentation.id, {
										slides: updatedSlides,
									});
								}}
							/>
						</div>

						<Separator />

						<div className="space-y-3">
							<Label htmlFor="slide-transition" className="font-semibold">
								Slide Transition
							</Label>
							<Select
								value={currentSlide.transition?.type || "fade"}
								onValueChange={(val: any) => {
									const updatedSlides = currentPresentation.slides.map(
										(s, i) =>
											i === currentSlideIndex
												? {
														...s,
														transition: {
															...s.transition,
															type: val,
															duration: 500,
														},
													}
												: s,
									);
									updatePresentation(currentPresentation.id, {
										slides: updatedSlides,
									});
								}}
							>
								<SelectTrigger id="slide-transition">
									<SelectValue placeholder="Select transition" />
								</SelectTrigger>
								<SelectContent>
									{[
										"none",
										"fade",
										"slide",
										"zoom",
										"blur",
										"cube",
										"flip",
									].map((t) => (
										<SelectItem key={t} value={t}>
											{t.charAt(0).toUpperCase() + t.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</ScrollArea>
				<div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
					<div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
						<Settings className="w-8 h-8 opacity-20" />
					</div>
					<h3 className="text-lg font-medium text-foreground mb-2">
						{language === "sk" ? "Žiadny vybratý prvok" : "No element selected"}
					</h3>
					<p className="max-w-[200px] text-sm leading-relaxed">
						{language === "sk"
							? "Vyberte prvok na plátne a upravte jeho vlastnosti"
							: "Select an element on the canvas to edit its properties"}
					</p>
				</div>
			</motion.div>
		);
	}

	const getElementIcon = () => {
		switch (draftElement.type) {
			case "text":
				return <Type className="w-5 h-5" />;
			case "image":
				return <ImageIcon className="w-5 h-5" />;
			case "shape":
				return <Square className="w-5 h-5" />;
			case "video":
				return <Video className="w-5 h-5" />;
			case "table":
				return <Table2 className="w-5 h-5" />;
			case "code":
				return <Code className="w-5 h-5" />;
			default:
				return <Layers className="w-5 h-5" />;
		}
	};

	return (
		<motion.div
			key={draftElement.id}
			initial={{ x: 320, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="w-80 bg-background border-l border-border flex flex-col h-full min-h-0 max-h-screen overflow-hidden"
		>
			<CardHeader className="flex-none shrink-0 border-b">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						{getElementIcon()}
						<span className="capitalize">{draftElement.type}</span>{" "}
						{t("editor.properties")}
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							if (
								confirm(
									language === "sk"
										? "Odstrániť tento prvok?"
										: "Delete this element?",
								)
							) {
								deleteElement(draftElement.id);
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
							<TabsTrigger value="style">{t("editor.properties")}</TabsTrigger>
							<TabsTrigger value="animation">Animation</TabsTrigger>
						</TabsList>

						<TabsContent value="style" className="space-y-6">
							<LayoutProperties
								element={draftElement}
								onUpdate={handleDraftUpdate}
							/>

							{draftElement.type === "text" && (
								<>
									<Separator />
									<TextProperties
										element={draftElement}
										onUpdate={handleDraftUpdate}
										getDefaultTextColor={getDefaultTextColor}
									/>
								</>
							)}

							{(draftElement.type === "image" ||
								draftElement.type === "video") && (
								<>
									<Separator />
									<MediaProperties
										element={draftElement}
										onUpdate={handleDraftUpdate}
									/>
								</>
							)}

							{draftElement.type === "shape" && (
								<>
									<Separator />
									<ShapeProperties
										element={draftElement}
										onUpdate={handleDraftUpdate}
									/>
								</>
							)}

							{draftElement.type === "table" && (
								<>
									<Separator />
									<TableProperties
										element={draftElement}
										onUpdate={handleDraftUpdate}
									/>
								</>
							)}
						</TabsContent>

						<TabsContent value="animation">
							<AnimationProperties
								element={draftElement}
								onUpdate={handleDraftUpdate}
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</ScrollArea>

			{/* Action Buttons */}
			<div className="p-4 border-t bg-muted/30 flex items-center gap-3 shrink-0">
				<Button className="flex-1" onClick={saveChanges} disabled={!hasChanges}>
					<Save className="w-4 h-4 mr-2" />
					{t("editor.saveChanges")}
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={discardChanges}
					disabled={!hasChanges}
				>
					<RotateCcw className="w-4 h-4" />
				</Button>
			</div>
		</motion.div>
	);
}
