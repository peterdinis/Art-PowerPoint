"use client";

import { usePresentationStore } from "@/lib/store/presentationStore";
import {
	Type,
	Image,
	Square,
	Circle,
	Triangle,
	Video,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Bold,
	Italic,
	Underline,
	Plus,
	ChevronDown,
	Heading1,
	Heading2,
	List,
	Link2,
	Code,
	Quote,
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Toolbar() {
	const {
		addElement,
		currentPresentation,
		currentSlideIndex,
		selectedElementId,
		updateElement,
	} = usePresentationStore();
	const { theme } = useTheme();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageDialogOpen, setImageDialogOpen] = useState(false);
	const [videoDialogOpen, setVideoDialogOpen] = useState(false);
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const [linkText, setLinkText] = useState("");

	// Get default text color based on theme
	const getDefaultTextColor = () => {
		if (typeof window === "undefined") return "#212121";
		const isDark = document.documentElement.classList.contains("dark");
		return isDark ? "#e5e5e5" : "#212121";
	};

	if (!currentPresentation) return null;

	const currentSlide = currentPresentation.slides[currentSlideIndex];
	const selectedElement = currentSlide?.elements.find(
		(el) => el.id === selectedElementId,
	);

	const handleAddText = (
		textType: "heading1" | "heading2" | "body" | "quote" | "code" = "body",
	) => {
		const styles: Record<
			string,
			{
				fontSize: number;
				fontWeight?: string;
				fontStyle?: string;
				fontFamily?: string;
			}
		> = {
			heading1: { fontSize: 48, fontWeight: "bold" },
			heading2: { fontSize: 36, fontWeight: "bold" },
			body: { fontSize: 24, fontWeight: "normal" },
			quote: { fontSize: 28, fontStyle: "italic" },
			code: { fontSize: 20, fontFamily: "Courier New" },
		};

		const contents = {
			heading1: "Nadpis 1",
			heading2: "Nadpis 2",
			body: "Text",
			quote: "Citát",
			code: "kód",
		};

		const styleConfig = styles[textType];

    addElement({
			type: "text",
      position: { x: 100, y: 100 },
			size: {
				width: 400,
				height:
					textType === "heading1" ? 80 : textType === "heading2" ? 60 : 50,
			},
			content: contents[textType],
      style: {
				fontSize: styleConfig.fontSize,
				color: getDefaultTextColor(),
				fontFamily: styleConfig.fontFamily || "Arial",
				fontWeight: styleConfig.fontWeight || "normal",
				fontStyle:
					styleConfig.fontStyle || (textType === "quote" ? "italic" : "normal"),
				textAlign: "left",
      },
    });
  };

  const handleAddImage = () => {
		if (imageUrl) {
			addElement({
				type: "image",
				position: { x: 100, y: 100 },
				size: { width: 400, height: 300 },
				content: imageUrl,
			});
			setImageUrl("");
			setImageDialogOpen(false);
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const result = event.target?.result as string;
				addElement({
					type: "image",
					position: { x: 100, y: 100 },
					size: { width: 400, height: 300 },
					content: result,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAddVideo = () => {
		if (videoUrl) {
			addElement({
				type: "video",
				position: { x: 100, y: 100 },
				size: { width: 640, height: 360 },
				content: videoUrl,
			});
			setVideoUrl("");
			setVideoDialogOpen(false);
		}
	};

	const handleAddLink = () => {
		if (linkUrl && linkText) {
      addElement({
				type: "text",
        position: { x: 100, y: 100 },
				size: { width: 200, height: 40 },
				content: linkText,
				style: {
					fontSize: 18,
					color: "#2563eb",
					textDecoration: "underline",
				},
			});
			setLinkUrl("");
			setLinkText("");
			setLinkDialogOpen(false);
		}
	};

	const handleAddShape = (
		shapeType:
			| "square"
			| "circle"
			| "triangle"
			| "rectangle"
			| "rounded"
			| "star",
	) => {
		const sizes = {
			square: { width: 200, height: 200 },
			circle: { width: 200, height: 200 },
			triangle: { width: 200, height: 200 },
			rectangle: { width: 300, height: 150 },
			rounded: { width: 250, height: 150 },
			star: { width: 200, height: 200 },
		};

		addElement({
			type: "shape",
			position: { x: 100, y: 100 },
			size: sizes[shapeType],
			content: shapeType,
			style: {
				backgroundColor: "#3b82f6",
				borderWidth: 0,
				borderColor: "#000000",
				...(shapeType === "rounded" && { borderRadius: "12px" }),
			},
		});
	};

	const handleAddList = (listType: "ordered" | "unordered") => {
		const items =
			listType === "ordered"
				? "1. Prvý bod\n2. Druhý bod\n3. Tretí bod"
				: "• Prvý bod\n• Druhý bod\n• Tretí bod";

    addElement({
			type: "text",
      position: { x: 100, y: 100 },
			size: { width: 300, height: 120 },
			content: items,
      style: {
				fontSize: 20,
				color: getDefaultTextColor(),
				fontFamily: "Arial",
				textAlign: "left",
      },
    });
  };

	const handleTextStyle = (property: string, value: any) => {
		if (selectedElement && selectedElement.type === "text") {
			updateElement(selectedElement.id, {
				style: {
					...selectedElement.style,
					[property]: value,
				},
			});
		}
  };

  return (
		<div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
			<div className="px-4 py-3">
				<div className="flex items-center gap-3 flex-wrap">
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="image/*"
						onChange={handleFileUpload}
					/>
					{/* Quick Add Buttons */}
					<div className="flex items-center gap-2">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={() => handleAddText("heading1")}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Heading1 className="w-4 h-4" />
								<span className="hidden sm:inline">H1</span>
							</Button>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={() => handleAddText("body")}
								variant="outline"
								size="sm"
								className="gap-2"
      >
        <Type className="w-4 h-4" />
								<span className="hidden sm:inline">Text</span>
							</Button>
						</motion.div>
						<Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
							<DialogTrigger asChild>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button variant="outline" size="sm" className="gap-2">
        <Image className="w-4 h-4" />
										<span className="hidden sm:inline">Obrázok</span>
									</Button>
								</motion.div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Pridať obrázok</DialogTitle>
									<DialogDescription>
										Zadajte URL obrázka alebo použite priamy odkaz
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="image-url-quick">URL obrázka</Label>
										<Input
											id="image-url-quick"
											value={imageUrl}
											onChange={(e) => setImageUrl(e.target.value)}
											placeholder="https://example.com/image.jpg"
										/>
									</div>
									{imageUrl && (
										<div className="rounded-lg overflow-hidden border">
											<img
												src={imageUrl}
												alt="Preview"
												className="w-full h-48 object-cover"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = "none";
												}}
											/>
										</div>
									)}

									<div className="flex items-center gap-4">
										<Separator className="flex-1" />
										<span className="text-xs text-muted-foreground">ALEBO</span>
										<Separator className="flex-1" />
									</div>

									<div className="flex justify-center">
										<Button
											variant="secondary"
											className="w-full"
											onClick={() => fileInputRef.current?.click()}
										>
											Nahrať z počítača
										</Button>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setImageDialogOpen(false)}
									>
										Zrušiť
									</Button>
									<Button onClick={handleAddImage} disabled={!imageUrl}>
										Pridať
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={() => handleAddShape("square")}
								variant="outline"
								size="sm"
								className="gap-2"
      >
        <Square className="w-4 h-4" />
							</Button>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={() => handleAddShape("star")}
								variant="outline"
								size="sm"
								className="gap-2"
								title="Pridať hviezdu"
							>
								<span className="text-lg leading-none">★</span>
							</Button>
						</motion.div>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Add Elements Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button variant="default" size="sm" className="gap-2">
									<Plus className="w-4 h-4" />
									Pridať
									<ChevronDown className="w-4 h-4" />
								</Button>
							</motion.div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-64">
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Text
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => handleAddText("heading1")}
								className="gap-3"
							>
								<div className="flex items-center gap-2">
									<Heading1 className="w-4 h-4" />
									<span>H1 Nadpis 1</span>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAddText("heading2")}
								className="gap-3"
							>
								<div className="flex items-center gap-2">
									<Heading2 className="w-4 h-4" />
									<span>H2 Nadpis 2</span>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAddText("body")}
								className="gap-3"
							>
								<div className="flex items-center gap-2">
									<Type className="w-4 h-4" />
									<span>T Text</span>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAddText("quote")}
								className="gap-3"
							>
								<div className="flex items-center gap-2">
									<Quote className="w-4 h-4" />
									<span>99 Citát</span>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAddText("code")}
								className="gap-3"
							>
								<div className="flex items-center gap-2">
									<Code className="w-4 h-4" />
									<span>&lt;&gt; Kód</span>
								</div>
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Zoznamy
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => handleAddList("ordered")}
								className="gap-3"
							>
								<List className="w-4 h-4" />
								<span>Číslovaný zoznam</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAddList("unordered")}
								className="gap-3"
							>
								<List className="w-4 h-4" />
								<span>Zoznam s odrážkami</span>
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Mediá
							</DropdownMenuLabel>
							<Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
								<DialogTrigger asChild>
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="gap-3"
									>
										<Image className="w-4 h-4" />
										<span>Obrázok</span>
									</DropdownMenuItem>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Pridať obrázok</DialogTitle>
										<DialogDescription>
											Zadajte URL obrázka alebo použite priamy odkaz
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="image-url">URL obrázka</Label>
											<Input
												id="image-url"
												value={imageUrl}
												onChange={(e) => setImageUrl(e.target.value)}
												placeholder="https://example.com/image.jpg"
											/>
										</div>
										{imageUrl && (
											<div className="rounded-lg overflow-hidden border">
												<img
													src={imageUrl}
													alt="Preview"
													className="w-full h-48 object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).style.display =
															"none";
													}}
												/>
											</div>
										)}

										<div className="flex items-center gap-4">
											<Separator className="flex-1" />
											<span className="text-xs text-muted-foreground">
												ALEBO
											</span>
											<Separator className="flex-1" />
										</div>

										<div className="flex justify-center">
											<Button
												variant="secondary"
												className="w-full"
												onClick={() => fileInputRef.current?.click()}
											>
												Nahrať z počítača
											</Button>
										</div>
									</div>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setImageDialogOpen(false)}
										>
											Zrušiť
										</Button>
										<Button onClick={handleAddImage} disabled={!imageUrl}>
											Pridať
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
								<DialogTrigger asChild>
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="gap-3"
									>
										<Video className="w-4 h-4" />
										<span>Video</span>
									</DropdownMenuItem>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Pridať video</DialogTitle>
										<DialogDescription>
											Zadajte URL videa (YouTube, Vimeo, atď.)
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="video-url">URL videa</Label>
											<Input
												id="video-url"
												value={videoUrl}
												onChange={(e) => setVideoUrl(e.target.value)}
												placeholder="https://youtube.com/watch?v=..."
											/>
										</div>
									</div>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setVideoDialogOpen(false)}
										>
											Zrušiť
										</Button>
										<Button onClick={handleAddVideo} disabled={!videoUrl}>
											Pridať
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Tvary
							</DropdownMenuLabel>
							<div className="grid grid-cols-2 gap-1 p-2">
								<DropdownMenuItem
									onClick={() => handleAddShape("square")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Square className="w-6 h-6" />
									<span className="text-xs">Štvorec</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("circle")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Circle className="w-6 h-6" />
									<span className="text-xs">Kruh</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("triangle")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Triangle className="w-6 h-6" />
									<span className="text-xs">Trojuholník</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("rectangle")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Square className="w-6 h-6 rotate-45" />
									<span className="text-xs">Obdĺžnik</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("star")}
									className="flex-col gap-2 h-auto py-3"
								>
									<span className="text-2xl leading-none">★</span>
									<span className="text-xs">Hviezda</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("rounded")}
									className="flex-col gap-2 h-auto py-3 col-span-2"
								>
									<Square className="w-6 h-6 rounded-md" />
									<span className="text-xs">Zaoblený obdĺžnik</span>
								</DropdownMenuItem>
							</div>

							<DropdownMenuSeparator />

							<Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
								<DialogTrigger asChild>
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="gap-3"
									>
										<Link2 className="w-4 h-4" />
										<span>Odkaz</span>
									</DropdownMenuItem>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Pridať odkaz</DialogTitle>
										<DialogDescription>
											Zadajte text a URL odkazu
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="link-text">Text odkazu</Label>
											<Input
												id="link-text"
												value={linkText}
												onChange={(e) => setLinkText(e.target.value)}
												placeholder="Kliknite tu"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="link-url">URL</Label>
											<Input
												id="link-url"
												value={linkUrl}
												onChange={(e) => setLinkUrl(e.target.value)}
												placeholder="https://example.com"
											/>
										</div>
									</div>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setLinkDialogOpen(false)}
										>
											Zrušiť
										</Button>
										<Button
											onClick={handleAddLink}
											disabled={!linkUrl || !linkText}
										>
											Pridať
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Text Formatting Tools */}
					{selectedElement && selectedElement.type === "text" && (
						<>
							<Separator orientation="vertical" className="h-6" />
							<div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button
										variant={
											selectedElement.style?.fontWeight === "bold"
												? "default"
												: "ghost"
										}
										size="icon"
										className="h-8 w-8"
										onClick={() =>
											handleTextStyle(
												"fontWeight",
												selectedElement.style?.fontWeight === "bold"
													? "normal"
													: "bold",
											)
										}
										title="Tučné"
									>
										<Bold className="w-4 h-4" />
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button
										variant={
											selectedElement.style?.fontStyle === "italic"
												? "default"
												: "ghost"
										}
										size="icon"
										className="h-8 w-8"
										onClick={() =>
											handleTextStyle(
												"fontStyle",
												selectedElement.style?.fontStyle === "italic"
													? "normal"
													: "italic",
											)
										}
										title="Kurzíva"
									>
										<Italic className="w-4 h-4" />
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button
										variant={
											selectedElement.style?.textDecoration === "underline"
												? "default"
												: "ghost"
										}
										size="icon"
										className="h-8 w-8"
										onClick={() =>
											handleTextStyle(
												"textDecoration",
												selectedElement.style?.textDecoration === "underline"
													? "none"
													: "underline",
											)
										}
										title="Podčiarknuté"
									>
										<Underline className="w-4 h-4" />
									</Button>
								</motion.div>
							</div>

							<Separator orientation="vertical" className="h-6" />
							<div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button
										variant={
											selectedElement.style?.textAlign === "left"
												? "default"
												: "ghost"
										}
										size="icon"
										className="h-8 w-8"
										onClick={() => handleTextStyle("textAlign", "left")}
										title="Zarovnať vľavo"
									>
										<AlignLeft className="w-4 h-4" />
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button
										variant={
											selectedElement.style?.textAlign === "center"
												? "default"
												: "ghost"
										}
										size="icon"
										className="h-8 w-8"
										onClick={() => handleTextStyle("textAlign", "center")}
										title="Zarovnať na stred"
									>
										<AlignCenter className="w-4 h-4" />
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Button
										variant={
											selectedElement.style?.textAlign === "right"
												? "default"
												: "ghost"
										}
										size="icon"
										className="h-8 w-8"
										onClick={() => handleTextStyle("textAlign", "right")}
										title="Zarovnať vpravo"
									>
										<AlignRight className="w-4 h-4" />
									</Button>
								</motion.div>
							</div>
						</>
					)}
				</div>
			</div>
    </div>
  );
}
