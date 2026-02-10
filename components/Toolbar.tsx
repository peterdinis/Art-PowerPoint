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
	Table,
	LineChart,
	PieChart,
	BarChart,
	Database,
	Calendar,
	Clock,
	MapPin,
	Phone,
	Mail,
	Globe,
	Music,
	Film,
	Mic,
	FileText,
	Download,
	Upload,
	Palette,
	Type as FontIcon,
	Sparkles,
	Star,
	Heart,
	Zap,
	Layers,
	Grid,
	Columns,
	Rows,
	PanelLeft,
	PanelRight,
	PanelTop,
	PanelBottom,
	Table2,
	TrendingUp,
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
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SlideElementType } from "@/lib/types/presentation";

const CHART_TEMPLATES = [
	{
		name: "Sales Q1-Q4",
		type: "bar",
		data: {
			labels: ["Q1", "Q2", "Q3", "Q4"],
			values: [45000, 52000, 48000, 61000],
			colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
		},
	},
	{
		name: "Monthly Traffic",
		type: "line",
		data: {
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
			values: [65, 59, 80, 81, 56, 55],
			colors: ["#ef4444"],
		},
	},
	{
		name: "Market Share",
		type: "pie",
		data: {
			labels: ["Product A", "Product B", "Product C", "Product D"],
			values: [35, 25, 20, 20],
			colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
		},
	},
	{
		name: "Revenue Growth",
		type: "area",
		data: {
			labels: ["2019", "2020", "2021", "2022", "2023"],
			values: [100, 150, 200, 180, 250],
			colors: ["#8b5cf6"],
		},
	},
];

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
	const [tableDialogOpen, setTableDialogOpen] = useState(false);
	const [chartDialogOpen, setChartDialogOpen] = useState(false);
	const [iconDialogOpen, setIconDialogOpen] = useState(false);
	const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
	const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const [linkText, setLinkText] = useState("");
	const [tableRows, setTableRows] = useState(3);
	const [tableColumns, setTableColumns] = useState(3);
	const [chartType, setChartType] = useState("bar");
	const [chartTitle, setChartTitle] = useState("");
	const [chartLabels, setChartLabels] = useState("Q1, Q2, Q3, Q4");
	const [chartValues, setChartValues] = useState("30, 45, 25, 60");
	const [selectedChartTemplate, setSelectedChartTemplate] = useState(
		CHART_TEMPLATES[0],
	);
	const [fontSize, setFontSize] = useState(24);
	const [fontFamily, setFontFamily] = useState("Arial");
	const [textColor, setTextColor] = useState("#212121");
	const [layoutType, setLayoutType] = useState("two-columns");

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
		textType:
			| "heading1"
			| "heading2"
			| "body"
			| "quote"
			| "code"
			| "title"
			| "subtitle" = "body",
	) => {
		const styles: Record<
			string,
			{
				fontSize: number;
				fontWeight?: string;
				fontStyle?: string;
				fontFamily?: string;
				color?: string;
			}
		> = {
			title: { fontSize: 64, fontWeight: "bold", color: "#1e40af" },
			heading1: { fontSize: 48, fontWeight: "bold" },
			heading2: { fontSize: 36, fontWeight: "bold" },
			subtitle: { fontSize: 32, fontStyle: "italic", color: "#6b7280" },
			body: { fontSize: 24, fontWeight: "normal" },
			quote: { fontSize: 28, fontStyle: "italic", color: "#6b7280" },
			code: { fontSize: 20, fontFamily: "Courier New", color: "#059669" },
		};

		const contents = {
			title: "Presentation Title",
			heading1: "Main Heading",
			heading2: "Sub Heading",
			subtitle: "Presentation Subtitle",
			body: "Add your text here...",
			quote: "The only way to do great work is to love what you do.",
			code: "console.log('Hello, World!');",
		};

		const styleConfig = styles[textType];

		addElement({
			type: "text",
			position: { x: 100, y: 100 },
			size: {
				width: textType === "title" ? 800 : textType === "subtitle" ? 600 : 400,
				height: textType === "title" ? 120 : textType === "subtitle" ? 80 : 60,
			},
			content: contents[textType],
			style: {
				fontSize: styleConfig.fontSize,
				color: styleConfig.color || getDefaultTextColor(),
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
				style: {
					borderRadius: "8px",
				},
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
					style: {
						borderRadius: "8px",
					},
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
				style: {
					borderRadius: "8px",
				},
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
			| "star"
			| "heart"
			| "hexagon"
			| "octagon"
			| "diamond",
	) => {
		const sizes = {
			square: { width: 200, height: 200 },
			circle: { width: 200, height: 200 },
			triangle: { width: 200, height: 200 },
			rectangle: { width: 300, height: 150 },
			rounded: { width: 250, height: 150 },
			star: { width: 200, height: 200 },
			heart: { width: 200, height: 180 },
			hexagon: { width: 200, height: 200 },
			octagon: { width: 200, height: 200 },
			diamond: { width: 200, height: 200 },
		};

		const colors = {
			square: "#3b82f6",
			circle: "#10b981",
			triangle: "#f59e0b",
			rectangle: "#8b5cf6",
			rounded: "#ef4444",
			star: "#fbbf24",
			heart: "#ec4899",
			hexagon: "#06b6d4",
			octagon: "#84cc16",
			diamond: "#6366f1",
		};

		addElement({
			type: "shape",
			position: { x: 100, y: 100 },
			size: sizes[shapeType],
			content: shapeType,
			style: {
				backgroundColor: colors[shapeType],
				borderWidth: 0,
				borderColor: "#000000",
				...(shapeType === "rounded" && { borderRadius: "12px" }),
				...(shapeType === "heart" && { color: colors[shapeType] }),
			},
		});
	};

	const handleAddList = (listType: "ordered" | "unordered" | "checklist") => {
		const items = {
			ordered: "1. First item\n2. Second item\n3. Third item",
			unordered: "• First item\n• Second item\n• Third item",
			checklist: "☐ First task\n☐ Second task\n☐ Third task",
		};

		addElement({
			type: "text",
			position: { x: 100, y: 100 },
			size: { width: 300, height: 120 },
			content: items[listType],
			style: {
				fontSize: 20,
				color: getDefaultTextColor(),
				fontFamily: "Arial",
				textAlign: "left",
			},
		});
	};

	const handleAddTable = () => {
		const tableContent = Array(tableRows)
			.fill(null)
			.map((_, rowIndex) =>
				Array(tableColumns)
					.fill(null)
					.map((_, colIndex) => `Cell ${rowIndex + 1}-${colIndex + 1}`)
					.join("\t"),
			)
			.join("\n");

		addElement({
			type: "text",
			position: { x: 100, y: 100 },
			size: { width: 400, height: 200 },
			content: tableContent,
			style: {
				fontSize: 14,
				color: getDefaultTextColor(),
				fontFamily: "Arial",
				textAlign: "left",
				backgroundColor: "#f9fafb",
			},
		});
		setTableDialogOpen(false);
	};

	const handleAddChart = () => {
		try {
			const parsedLabels = chartLabels.split(",").map((l) => l.trim());
			const parsedValues = chartValues
				.split(",")
				.map((v) => parseFloat(v.trim()));

			const chartData = {
				type: chartType,
				chartTitle,
				labels: parsedLabels,
				values: parsedValues,
				colors: selectedChartTemplate.data.colors,
			};

			addElement({
				type: "chart",
				position: { x: 100, y: 100 },
				size: { width: 500, height: 350 },
				content: JSON.stringify(chartData),
				style: {
					chartType,
					chartTitle,
					backgroundColor: "#ffffff",
					borderRadius: "8px",
					borderWidth: 1,
					borderColor: "#e5e7eb",
				},
			});

			setChartDialogOpen(false);
			// Reset form
			setChartTitle("");
			setChartLabels("Q1, Q2, Q3, Q4");
			setChartValues("30, 45, 25, 60");
			setSelectedChartTemplate(CHART_TEMPLATES[0]);
		} catch (error) {
			console.error("Error adding chart:", error);
		}
	};

	const handleChartTemplateSelect = (template: (typeof CHART_TEMPLATES)[0]) => {
		setSelectedChartTemplate(template);
		setChartType(template.type);
		setChartTitle(template.name);
		setChartLabels(template.data.labels.join(", "));
		setChartValues(template.data.values.join(", "));
	};

	const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result as string;
				const lines = content.split("\n");

				if (lines.length >= 2) {
					const labels = lines[0].split(",").map((l) => l.trim());
					const values = lines[1].split(",").map((v) => v.trim());

					setChartLabels(labels.join(", "));
					setChartValues(values.join(", "));

					// Try to detect chart type from filename
					if (file.name.toLowerCase().includes("line")) setChartType("line");
					if (file.name.toLowerCase().includes("pie")) setChartType("pie");
					if (file.name.toLowerCase().includes("area")) setChartType("area");
				}
			} catch (error) {
				console.error("Error parsing CSV:", error);
			}
		};
		reader.readAsText(file);
	};

	const handleAddLayout = (type: string) => {
		const layouts = {
			"two-columns": {
				content: "[Content Left]\n\n[Content Right]",
				width: 600,
				height: 400,
			},
			"three-columns": {
				content: "[Left]\n\n[Center]\n\n[Right]",
				width: 600,
				height: 400,
			},
			"header-content": {
				content: "[Header]\n\n[Main Content]\n\n[Footer]",
				width: 600,
				height: 400,
			},
			sidebar: {
				content: "[Sidebar]\n\n[Main Content]",
				width: 600,
				height: 400,
			},
		};

		const layout =
			layouts[type as keyof typeof layouts] || layouts["two-columns"];

		addElement({
			type: "text",
			position: { x: 100, y: 100 },
			size: { width: layout.width, height: layout.height },
			content: layout.content,
			style: {
				fontSize: 14,
				color: "#6b7280",
				fontFamily: "Arial",
				textAlign: "center",
				backgroundColor: "#f1f5f9",
			},
		});
	};

	const handleAddIcon = (iconType: string) => {
		const icons = {
			calendar: "📅",
			clock: "⏰",
			location: "📍",
			phone: "📞",
			email: "📧",
			globe: "🌐",
			music: "🎵",
			film: "🎬",
			mic: "🎤",
			star: "⭐",
			heart: "❤️",
			sparkles: "✨",
			zap: "⚡",
		};

		const icon = icons[iconType as keyof typeof icons] || "⭐";

		addElement({
			type: "text",
			position: { x: 100, y: 100 },
			size: { width: 60, height: 60 },
			content: icon,
			style: {
				fontSize: 40,
				color: "#3b82f6",
				fontFamily: "Arial",
				textAlign: "center",
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

	const handleAddMedia = (mediaType: string) => {
		const mediaElements = {
			audio: {
				type: "text",
				content: "🎵 Audio Player\n\nClick to play audio",
				size: { width: 300, height: 100 },
				style: {
					fontSize: 16,
					color: getDefaultTextColor(),
					textAlign: "center",
					border: "2px solid #60a5fa",
					borderRadius: "8px",
					padding: "16px",
					backgroundColor: "#dbeafe",
				},
			},
			podcast: {
				type: "text",
				content: "🎙️ Podcast Episode\n\nEpisode Title Here",
				size: { width: 300, height: 100 },
				style: {
					fontSize: 16,
					color: getDefaultTextColor(),
					textAlign: "center",
					border: "2px solid #8b5cf6",
					borderRadius: "8px",
					padding: "16px",
					backgroundColor: "#f3e8ff",
				},
			},
			document: {
				type: "text",
				content: "📄 Document\n\nClick to view document",
				size: { width: 300, height: 100 },
				style: {
					fontSize: 16,
					color: getDefaultTextColor(),
					textAlign: "center",
					border: "2px solid #10b981",
					borderRadius: "8px",
					padding: "16px",
					backgroundColor: "#d1fae5",
				},
			},
		};

		const media = mediaElements[mediaType as keyof typeof mediaElements];
		if (media) {
			addElement({
				type: media.type as SlideElementType,
				position: { x: 100, y: 100 },
				size: media.size,
				content: media.content,
				style: media.style as any,
			});
		}
	};

	return (
		<div className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border shadow-sm">
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
								onClick={() => handleAddText("title")}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Heading1 className="w-4 h-4" />
								<span className="hidden sm:inline">Title</span>
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
										<span className="hidden sm:inline">Image</span>
									</Button>
								</motion.div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Image</DialogTitle>
									<DialogDescription>
										Enter image URL or use direct link
									</DialogDescription>
								</DialogHeader>
								<Tabs defaultValue="url" className="w-full">
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="url">From URL</TabsTrigger>
										<TabsTrigger value="upload">Upload</TabsTrigger>
									</TabsList>
									<TabsContent value="url" className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="image-url-quick">Image URL</Label>
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
														(e.target as HTMLImageElement).style.display =
															"none";
													}}
												/>
											</div>
										)}
										<Button
											onClick={handleAddImage}
											disabled={!imageUrl}
											className="w-full"
										>
											Add Image
										</Button>
									</TabsContent>
									<TabsContent value="upload" className="space-y-4 py-4">
										<div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
											<Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
											<p className="text-sm text-muted-foreground mb-4">
												Drag & drop or click to upload
											</p>
											<Button
												variant="secondary"
												className="w-full"
												onClick={() => fileInputRef.current?.click()}
											>
												Select File
											</Button>
										</div>
									</TabsContent>
								</Tabs>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setImageDialogOpen(false)}
									>
										Cancel
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={() => handleAddShape("star")}
								variant="outline"
								size="sm"
								className="gap-2"
								title="Add star"
							>
								<Star className="w-4 h-4" />
							</Button>
						</motion.div>
						<Dialog open={chartDialogOpen} onOpenChange={setChartDialogOpen}>
							<DialogTrigger asChild>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button variant="outline" size="sm" className="gap-2">
										<BarChart className="w-4 h-4" />
										<span className="hidden sm:inline">Chart</span>
									</Button>
								</motion.div>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Add Chart</DialogTitle>
									<DialogDescription>
										Create beautiful data visualizations for your presentation
									</DialogDescription>
								</DialogHeader>

								<Tabs defaultValue="templates" className="w-full">
									<TabsList className="grid w-full grid-cols-3">
										<TabsTrigger value="templates">Templates</TabsTrigger>
										<TabsTrigger value="custom">Custom</TabsTrigger>
										<TabsTrigger value="import">Import</TabsTrigger>
									</TabsList>

									<TabsContent value="templates" className="space-y-4 py-4">
										<div className="grid grid-cols-2 gap-3">
											{CHART_TEMPLATES.map((template) => (
												<div
													key={template.name}
													className={`border rounded-lg p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
														selectedChartTemplate.name === template.name
															? "border-primary ring-2 ring-primary/20 bg-primary/5"
															: "border-border"
													}`}
													onClick={() => handleChartTemplateSelect(template)}
												>
													<div className="flex items-center gap-3 mb-2">
														{template.type === "bar" && (
															<BarChart className="w-5 h-5 text-blue-500" />
														)}
														{template.type === "line" && (
															<LineChart className="w-5 h-5 text-red-500" />
														)}
														{template.type === "pie" && (
															<PieChart className="w-5 h-5 text-green-500" />
														)}
														{template.type === "area" && (
															<TrendingUp className="w-5 h-5 text-purple-500" />
														)}
														<span className="font-medium">{template.name}</span>
													</div>
													<div className="text-sm text-muted-foreground">
														<div>Labels: {template.data.labels.join(", ")}</div>
														<div>Values: {template.data.values.join(", ")}</div>
													</div>
												</div>
											))}
										</div>
									</TabsContent>

									<TabsContent value="custom" className="space-y-4 py-4">
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="chart-title">Chart Title</Label>
												<Input
													id="chart-title"
													value={chartTitle}
													onChange={(e) => setChartTitle(e.target.value)}
													placeholder="Sales Performance 2023"
												/>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="chart-type">Chart Type</Label>
													<Select
														value={chartType}
														onValueChange={setChartType}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="bar">Bar Chart</SelectItem>
															<SelectItem value="line">Line Chart</SelectItem>
															<SelectItem value="pie">Pie Chart</SelectItem>
															<SelectItem value="area">Area Chart</SelectItem>
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label htmlFor="chart-size">Chart Size</Label>
													<Select defaultValue="medium">
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="small">
																Small (400×300)
															</SelectItem>
															<SelectItem value="medium">
																Medium (500×350)
															</SelectItem>
															<SelectItem value="large">
																Large (600×400)
															</SelectItem>
															<SelectItem value="custom">
																Custom Size
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="chart-labels">
														Labels (comma separated)
													</Label>
													<Input
														id="chart-labels"
														value={chartLabels}
														onChange={(e) => setChartLabels(e.target.value)}
														placeholder="Q1, Q2, Q3, Q4"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="chart-values">
														Values (comma separated)
													</Label>
													<Input
														id="chart-values"
														value={chartValues}
														onChange={(e) => setChartValues(e.target.value)}
														placeholder="30, 45, 25, 60"
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label>Preview</Label>
												<div className="border rounded-lg p-4 bg-muted/30">
													<div className="text-sm text-muted-foreground">
														<div>Type: {chartType}</div>
														<div>Labels: {chartLabels}</div>
														<div>Values: {chartValues}</div>
														{chartTitle && <div>Title: {chartTitle}</div>}
													</div>
												</div>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="import" className="space-y-4 py-4">
										<div className="space-y-4">
											<div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
												<Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
												<p className="text-sm text-muted-foreground mb-4">
													Upload CSV file with your data
												</p>
												<div className="space-y-2">
													<Input
														type="file"
														accept=".csv"
														onChange={handleCSVUpload}
														className="cursor-pointer"
													/>
													<p className="text-xs text-muted-foreground">
														Expected format: First row labels, second row values
													</p>
												</div>
											</div>

											<div className="space-y-2">
												<Label>CSV Format Example</Label>
												<div className="border rounded-lg p-4 bg-muted/30 font-mono text-sm">
													<div>Quarter, Sales, Expenses, Profit</div>
													<div>Q1, 45000, 30000, 15000</div>
													<div>Q2, 52000, 35000, 17000</div>
													<div>Q3, 48000, 32000, 16000</div>
													<div>Q4, 61000, 40000, 21000</div>
												</div>
											</div>
										</div>
									</TabsContent>
								</Tabs>

								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setChartDialogOpen(false)}
									>
										Cancel
									</Button>
									<Button onClick={handleAddChart}>Add Chart to Slide</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{/* Chart templates dropdown for quick access */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<TrendingUp className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								<DropdownMenuLabel>Quick Chart Templates</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{CHART_TEMPLATES.map((template) => (
									<DropdownMenuItem
										key={template.name}
										onClick={() => {
											handleChartTemplateSelect(template);
											setTimeout(() => setChartDialogOpen(true), 100);
										}}
										className="gap-3"
									>
										{template.type === "bar" && (
											<BarChart className="w-4 h-4 text-blue-500" />
										)}
										{template.type === "line" && (
											<LineChart className="w-4 h-4 text-red-500" />
										)}
										{template.type === "pie" && (
											<PieChart className="w-4 h-4 text-green-500" />
										)}
										{template.type === "area" && (
											<TrendingUp className="w-4 h-4 text-purple-500" />
										)}
										<span>{template.name}</span>
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => setChartDialogOpen(true)}
									className="gap-3"
								>
									<Download className="w-4 h-4" />
									<span>Import from CSV</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Main Add Elements Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button variant="default" size="sm" className="gap-2">
									<Plus className="w-4 h-4" />
									Add Elements
									<ChevronDown className="w-4 h-4" />
								</Button>
							</motion.div>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-80 max-h-[80vh] overflow-y-auto"
						>
							<DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
								<span>Text Elements</span>
								<FontIcon className="w-3 h-3" />
							</DropdownMenuLabel>
							<div className="grid grid-cols-2 gap-1 p-2">
								<DropdownMenuItem
									onClick={() => handleAddText("title")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Heading1 className="w-6 h-6" />
									<span className="text-xs">Title</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddText("heading1")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Heading1 className="w-6 h-6" />
									<span className="text-xs">Heading 1</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddText("heading2")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Heading2 className="w-6 h-6" />
									<span className="text-xs">Heading 2</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddText("body")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Type className="w-6 h-6" />
									<span className="text-xs">Body Text</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddText("quote")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Quote className="w-6 h-6" />
									<span className="text-xs">Quote</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddText("code")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Code className="w-6 h-6" />
									<span className="text-xs">Code Block</span>
								</DropdownMenuItem>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
								<span>Lists</span>
								<List className="w-3 h-3" />
							</DropdownMenuLabel>
							<div className="grid grid-cols-3 gap-1 p-2">
								<DropdownMenuItem
									onClick={() => handleAddList("ordered")}
									className="flex-col gap-2 h-auto py-3"
								>
									<span className="text-lg">1.</span>
									<span className="text-xs">Numbered</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddList("unordered")}
									className="flex-col gap-2 h-auto py-3"
								>
									<span className="text-lg">•</span>
									<span className="text-xs">Bulleted</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddList("checklist")}
									className="flex-col gap-2 h-auto py-3"
								>
									<span className="text-lg">☐</span>
									<span className="text-xs">Checklist</span>
								</DropdownMenuItem>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
								<span>Media</span>
								<Image className="w-3 h-3" />
							</DropdownMenuLabel>
							<div className="grid grid-cols-3 gap-1 p-2">
								<Dialog
									open={imageDialogOpen}
									onOpenChange={setImageDialogOpen}
								>
									<DialogTrigger asChild>
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											className="flex-col gap-2 h-auto py-3"
										>
											<Image className="w-6 h-6" />
											<span className="text-xs">Image</span>
										</DropdownMenuItem>
									</DialogTrigger>
								</Dialog>
								<Dialog
									open={videoDialogOpen}
									onOpenChange={setVideoDialogOpen}
								>
									<DialogTrigger asChild>
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											className="flex-col gap-2 h-auto py-3"
										>
											<Video className="w-6 h-6" />
											<span className="text-xs">Video</span>
										</DropdownMenuItem>
									</DialogTrigger>
								</Dialog>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											className="flex-col gap-2 h-auto py-3"
										>
											<Music className="w-6 h-6" />
											<span className="text-xs">Audio</span>
										</DropdownMenuItem>
									</DropdownMenuTrigger>
									<DropdownMenuContent side="right">
										<DropdownMenuItem onClick={() => handleAddMedia("audio")}>
											<Music className="w-4 h-4 mr-2" />
											Audio Player
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleAddMedia("podcast")}>
											<Mic className="w-4 h-4 mr-2" />
											Podcast
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
								<span>Shapes & Icons</span>
								<Square className="w-3 h-3" />
							</DropdownMenuLabel>
							<div className="grid grid-cols-3 gap-1 p-2">
								<DropdownMenuItem
									onClick={() => handleAddShape("square")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Square className="w-6 h-6" />
									<span className="text-xs">Square</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("circle")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Circle className="w-6 h-6" />
									<span className="text-xs">Circle</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddShape("heart")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Heart className="w-6 h-6" />
									<span className="text-xs">Heart</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddIcon("star")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Star className="w-6 h-6" />
									<span className="text-xs">Star Icon</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddIcon("sparkles")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Sparkles className="w-6 h-6" />
									<span className="text-xs">Sparkles</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddIcon("zap")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Zap className="w-6 h-6" />
									<span className="text-xs">Zap</span>
								</DropdownMenuItem>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
								<span>Data & Tables</span>
								<Table2 className="w-3 h-3" />
							</DropdownMenuLabel>
							<div className="grid grid-cols-2 gap-1 p-2">
								<Dialog
									open={tableDialogOpen}
									onOpenChange={setTableDialogOpen}
								>
									<DialogTrigger asChild>
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											className="flex-col gap-2 h-auto py-3"
										>
											<Table className="w-6 h-6" />
											<span className="text-xs">Table</span>
										</DropdownMenuItem>
									</DialogTrigger>
								</Dialog>
								<Dialog
									open={chartDialogOpen}
									onOpenChange={setChartDialogOpen}
								>
									<DialogTrigger asChild>
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											className="flex-col gap-2 h-auto py-3"
										>
											<BarChart className="w-6 h-6" />
											<span className="text-xs">Chart</span>
										</DropdownMenuItem>
									</DialogTrigger>
								</Dialog>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
								<span>Layouts</span>
								<Grid className="w-3 h-3" />
							</DropdownMenuLabel>
							<div className="grid grid-cols-2 gap-1 p-2">
								<DropdownMenuItem
									onClick={() => handleAddLayout("two-columns")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Columns className="w-6 h-6" />
									<span className="text-xs">Two Columns</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddLayout("three-columns")}
									className="flex-col gap-2 h-auto py-3"
								>
									<Layers className="w-6 h-6" />
									<span className="text-xs">Three Columns</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleAddLayout("header-content")}
									className="flex-col gap-2 h-auto py-3 col-span-2"
								>
									<PanelTop className="w-6 h-6" />
									<span className="text-xs">Header-Content-Footer</span>
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
										<span>Link</span>
									</DropdownMenuItem>
								</DialogTrigger>
							</Dialog>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Table Dialog */}
					<Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Table</DialogTitle>
								<DialogDescription>
									Configure your table dimensions
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-6 py-4">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="table-rows">Rows: {tableRows}</Label>
										<Slider
											id="table-rows"
											min={1}
											max={10}
											step={1}
											value={[tableRows]}
											onValueChange={(value) => setTableRows(value[0])}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="table-columns">
											Columns: {tableColumns}
										</Label>
										<Slider
											id="table-columns"
											min={1}
											max={8}
											step={1}
											value={[tableColumns]}
											onValueChange={(value) => setTableColumns(value[0])}
										/>
									</div>
								</div>
								<div className="border rounded-lg p-4 bg-muted/30">
									<div className="text-sm text-muted-foreground mb-2">
										Preview:
									</div>
									<div className="inline-block border">
										{Array(tableRows)
											.fill(null)
											.map((_, rowIndex) => (
												<div key={rowIndex} className="flex">
													{Array(tableColumns)
														.fill(null)
														.map((_, colIndex) => (
															<div
																key={colIndex}
																className="w-16 h-8 border flex items-center justify-center text-xs"
															>
																{rowIndex + 1}-{colIndex + 1}
															</div>
														))}
												</div>
											))}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setTableDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={handleAddTable}>Add Table</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Video Dialog */}
					<Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Video</DialogTitle>
								<DialogDescription>
									Enter video URL (YouTube, Vimeo, etc.)
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="video-url">Video URL</Label>
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
									Cancel
								</Button>
								<Button onClick={handleAddVideo} disabled={!videoUrl}>
									Add Video
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Link Dialog */}
					<Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Link</DialogTitle>
								<DialogDescription>Enter link text and URL</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="link-text">Link Text</Label>
									<Input
										id="link-text"
										value={linkText}
										onChange={(e) => setLinkText(e.target.value)}
										placeholder="Click here"
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
									Cancel
								</Button>
								<Button
									onClick={handleAddLink}
									disabled={!linkUrl || !linkText}
								>
									Add Link
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Text Formatting Tools */}
					{selectedElement && selectedElement.type === "text" && (
						<>
							<Separator orientation="vertical" className="h-6" />
							<div className="flex items-center gap-2">
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
											title="Bold"
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
											title="Italic"
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
											title="Underline"
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
											title="Align left"
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
											title="Align center"
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
											title="Align right"
										>
											<AlignRight className="w-4 h-4" />
										</Button>
									</motion.div>
								</div>

								{/* Font Size Control */}
								<Separator orientation="vertical" className="h-6" />
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">Size:</span>
									<Select
										value={selectedElement.style?.fontSize?.toString() || "24"}
										onValueChange={(value) =>
											handleTextStyle("fontSize", parseInt(value))
										}
									>
										<SelectTrigger className="w-20 h-8">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64].map(
												(size) => (
													<SelectItem key={size} value={size.toString()}>
														{size}px
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>

								{/* Font Family Control */}
								<Separator orientation="vertical" className="h-6" />
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">Font:</span>
									<Select
										value={selectedElement.style?.fontFamily || "Arial"}
										onValueChange={(value) =>
											handleTextStyle("fontFamily", value)
										}
									>
										<SelectTrigger className="w-32 h-8">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Arial">Arial</SelectItem>
											<SelectItem value="Helvetica">Helvetica</SelectItem>
											<SelectItem value="Times New Roman">
												Times New Roman
											</SelectItem>
											<SelectItem value="Georgia">Georgia</SelectItem>
											<SelectItem value="Courier New">Courier New</SelectItem>
											<SelectItem value="Verdana">Verdana</SelectItem>
											<SelectItem value="Tahoma">Tahoma</SelectItem>
											<SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
											<SelectItem value="Comic Sans MS">
												Comic Sans MS
											</SelectItem>
											<SelectItem value="Impact">Impact</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
